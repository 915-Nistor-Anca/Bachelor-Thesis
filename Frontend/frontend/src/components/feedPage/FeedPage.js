import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeedPage.css';

const FeedPage = () => {
    const navigate = useNavigate();
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [followingUsers, setFollowingUsers] = useState([]);
    const [lastObservations, setLastObservations] = useState([]);
    const [skyConditionsMap, setSkyConditionsMap] = useState({});
    const [equipmentMap, setEquipmentMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const getUserIdFromCookie = () => {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
        const userCookie = cookies.find(cookie => cookie[0] === 'user_id');
        return userCookie ? userCookie[1] : null;
    };

    useEffect(() => {
        const loggedInId = getUserIdFromCookie();
        if (!loggedInId) {
            console.error('User ID cookie not found');
            navigate('/login');
            return;
        }
        setLoggedInUserId(loggedInId);
    }, [navigate]);

    useEffect(() => {
        if (!loggedInUserId) return;

        const fetchFollowingUsers = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/polaris/userprofiles/${loggedInUserId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch following users.');
                }
                const data = await response.json();
                setFollowingUsers(data.following);
            } catch (error) {
                console.error('Error fetching following users:', error);
            }
        };

        fetchFollowingUsers();
    }, [loggedInUserId]);

    useEffect(() => {
        if (followingUsers.length === 0) return;

        const fetchLastObservations = async () => {
            const observationsPromises = followingUsers.map(async userId => {
                try {
                    const userResponse = await fetch(`http://127.0.0.1:8000/polaris/users/${userId}`);
                    if (!userResponse.ok) {
                        throw new Error(`Failed to fetch user data for user with ID ${userId}`);
                    }
                    const userData = await userResponse.json();
                    const username = userData.username;

                    const observationResponse = await fetch(`http://127.0.0.1:8000/polaris/observations-user/${userId}/`);
                    if (!observationResponse.ok) {
                        throw new Error(`Failed to fetch observations for user with ID ${userId}`);
                    }
                    const data = await observationResponse.json();
                    const publicObservations = data.filter(observation => observation.privacy === 0);
                    const lastObservation = publicObservations.length > 0 ? publicObservations[publicObservations.length - 1] : null;

                    const uniqueSkyConditionIds = new Set(data.map(obs => obs.sky_conditions));
                    const uniqueEquipmentIds = new Set(data.flatMap(obs => obs.equipment));

                    return { lastObservation, username, uniqueSkyConditionIds, uniqueEquipmentIds };
                } catch (error) {
                    console.error('Error fetching observations:', error);
                    return null;
                }
            });

            const observationsData = await Promise.all(observationsPromises);
            const validObservations = observationsData.filter(observation => observation && observation.lastObservation);
            const allSkyConditionIds = new Set(validObservations.flatMap(obs => [...obs.uniqueSkyConditionIds]));
            const allEquipmentIds = new Set(validObservations.flatMap(obs => [...obs.uniqueEquipmentIds]));

            const fetchSkyConditions = Array.from(allSkyConditionIds).map(async id => {
                try {
                    const response = await fetch(`http://127.0.0.1:8000/polaris/skyconditions/${id}/`);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch sky condition with ID ${id}`);
                    }
                    const data = await response.json();
                    return { id, name: data.name };
                } catch (error) {
                    console.error(`Error fetching sky condition with ID ${id}:`, error);
                    return null;
                }
            });

            const fetchEquipment = Array.from(allEquipmentIds).map(async id => {
                try {
                    const response = await fetch(`http://127.0.0.1:8000/polaris/equipments/${id}/`);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch equipment with ID ${id}`);
                    }
                    const data = await response.json();
                    return { id, name: data.name };
                } catch (error) {
                    console.error(`Error fetching equipment with ID ${id}:`, error);
                    return null;
                }
            });

            const skyConditionsData = await Promise.all(fetchSkyConditions);
            const equipmentData = await Promise.all(fetchEquipment);

            const skyConditionsMap = skyConditionsData.reduce((acc, item) => {
                if (item) acc[item.id] = item.name;
                return acc;
            }, {});

            const equipmentMap = equipmentData.reduce((acc, item) => {
                if (item) acc[item.id] = item.name;
                return acc;
            }, {});

            setSkyConditionsMap(skyConditionsMap);
            setEquipmentMap(equipmentMap);
            setLastObservations(validObservations.map(obs => ({
                ...obs.lastObservation,
                username: obs.username
            })).slice(-15));
            setIsLoading(false);
        };

        fetchLastObservations();
    }, [followingUsers]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const redirectToUserProfile = (username) => {
        navigate(`/user/${username}`);
    };

    return (
        <div className="feed-container">
            <h1>Feed</h1>
            {lastObservations.length === 0 ? (
                <p>No observations available</p>
            ) : (
                <ul className="observation-list">
                    {lastObservations.map((observation, index) => (
                        <li className="observation-item" key={index}>
                            {/* <div className="username">
                                User: {observation.username}
                            </div> */}
                            <a className="username" onClick={() => redirectToUserProfile(observation.username)}>{observation.username}</a>
                            <div className="observation-details">
                                <p><strong>Targets:</strong> {observation.targets}</p>
                                <p><strong>Location:</strong> {observation.location}</p>
                                <p><strong>Observation Time:</strong> {observation.observation_time}</p>
                                <p><strong>Sky Conditions:</strong> {skyConditionsMap[observation.sky_conditions]}</p>
                                <p><strong>Equipment:</strong> {observation.equipment.map(id => equipmentMap[id]).join(', ')}</p>
                                <p><strong>Personal Observations:</strong> {observation.personal_observations}</p>
                                <p><strong>Privacy:</strong>{observation.privacy === 1 ? "Private" : "Public"}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FeedPage;
