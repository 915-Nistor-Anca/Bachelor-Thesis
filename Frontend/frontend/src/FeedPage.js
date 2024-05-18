import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FeedPage = () => {
    const navigate = useNavigate();
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [followingUsers, setFollowingUsers] = useState([]);
    const [lastObservations, setLastObservations] = useState([]);

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
    }, [navigate, loggedInUserId]);

    useEffect(() => {
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
                    console.log("LAST OBSERVATION:", lastObservation);

                    return lastObservation ? { ...lastObservation, username } : null;
                } catch (error) {
                    console.error('Error fetching observations:', error);
                    return null;
                }
            });

            const observations = await Promise.all(observationsPromises);
            setLastObservations(observations.filter(observation => observation !== null));
        };

        fetchLastObservations();
        console.log(lastObservations);
    }, [followingUsers]);

    return (
        <div>
            <h1>Feed</h1>
            {lastObservations.length === 0 ? (
                <p>No observations available</p>
            ) : (
                <ul>
                    {lastObservations.map((observation, index) => (
                        <li key={index}>
                            <div>
                                <strong>User:</strong> {observation.username}
                            </div>
                            <div>
                            <p><strong>Targets:</strong> {observation.targets}</p>
                            <p><strong>Location:</strong> {observation.location}</p>
                            <p><strong>Observation Time:</strong> {observation.observation_time}</p>
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
