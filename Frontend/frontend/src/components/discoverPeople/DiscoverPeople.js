import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DiscoverPeople.css';

const DiscoverPeople = () => {
    const navigate = useNavigate();
    const [usersData, setUsersData] = useState([]);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [randomObservations, setRandomObservations] = useState([]);

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

        const fetchUserData = async () => {
            try {
                const [usersResponse, profileResponse] = await Promise.all([
                    fetch(`http://127.0.0.1:8000/polaris/users/`),
                    fetch(`http://127.0.0.1:8000/polaris/userprofiles/${loggedInUserId}/`)
                ]);

                if (!usersResponse.ok || !profileResponse.ok) {
                    throw new Error('Failed to fetch data.');
                }

                const usersData = await usersResponse.json();
                const profileData = await profileResponse.json();

                const followingIds = profileData.following;

                const filteredUsersData = usersData.filter(user => !followingIds.includes(user.id) && user.id != loggedInUserId);

                setUsersData(filteredUsersData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUserData();
    }, [loggedInUserId]);

    useEffect(() => {
        if (!loggedInUserId) return;

        const fetchRandomObservations = async () => {
            try {
                const [observationsResponse, profileResponse] = await Promise.all([
                    fetch(`http://127.0.0.1:8000/polaris/observations/`),
                    fetch(`http://127.0.0.1:8000/polaris/userprofiles/${loggedInUserId}/`)
                ]);

                if (!observationsResponse.ok || !profileResponse.ok) {
                    throw new Error('Failed to fetch data.');
                }

                const [observationsData, profileData] = await Promise.all([
                    observationsResponse.json(),
                    profileResponse.json()
                ]);

                const followingIds = profileData.following;

                const filteredObservations = observationsData.filter(observation =>
                    !followingIds.includes(observation.user) && observation.user != loggedInUserId && observation.privacy === 0
                );

                const randomObservations = filteredObservations.sort(() => 0.5 - Math.random()).slice(0, 5);

                // Fetch usernames for each observation
                const observationPromises = randomObservations.map(async observation => {
                    try {
                        const userResponse = await fetch(`http://127.0.0.1:8000/polaris/users/${observation.user}`);
                        if (!userResponse.ok) {
                            throw new Error(`Failed to fetch user data for user with ID ${observation.user}`);
                        }
                        const userData = await userResponse.json();
                        return {
                            ...observation,
                            username: userData.username
                        };
                    } catch (error) {
                        console.error(`Error fetching username for user with ID ${observation.user}:`, error);
                        return null;
                    }
                });

                const observationsWithUsername = await Promise.all(observationPromises);

                const validObservations = observationsWithUsername.filter(observation => observation !== null);

                setRandomObservations(validObservations);
            } catch (error) {
                console.error('Error fetching observations:', error);
            }
        };

        fetchRandomObservations();
    }, [loggedInUserId]);

    const handleButtonClick = async (userId, following) => {
        try {
            const endpoint = following 
                ? `http://127.0.0.1:8000/polaris/unfollow/${loggedInUserId}/${userId}`
                : `http://127.0.0.1:8000/polaris/follow/${loggedInUserId}/${userId}`;
            const response = await fetch(endpoint);
    
            if (!response.ok) {
                throw new Error('Failed to update follow status.');
            }
    
            const updatedUsersData = usersData.map(user => {
                if (user.id === userId) {
                    return { ...user, following: !following };
                }
                return user;
            });
            setUsersData(updatedUsersData);
        } catch (error) {
            console.error('Error updating follow status:', error);
        }
    };
    
    const redirectToUserProfile = (username) => {
        navigate(`/user/${username}`);
    };

    return (
        <div className="discover-people">
            <div className="left-column">
                <h2>Discover new people</h2>
                {usersData.slice(0, Math.ceil(usersData.length / 2)).map((userData, index) => (
                    <div key={index} className="user-card">
                        <p className="username"><a onClick={() => redirectToUserProfile(userData.username)}>{userData.username}</a></p>
                        <p>{userData.email}</p>
                        <button onClick={() => handleButtonClick(userData.id, false)}>Follow</button>
                    </div>
                ))}
            </div>
            <div className="middle-column">
                <h2>Public observations of people you might befriend!</h2>
                {randomObservations.length === 0 ? (
                    <p>No observations available</p>
                ) : (
                    <ul className="observation-list">
                        {randomObservations.map((observation, index) => (
                            <li className="observation-item" key={index}>
                                <p className="username"><a onClick={() => redirectToUserProfile(observation.username)}>{observation.username}</a></p>
                                <div className="observation-details">
                                    <p><strong>Targets:</strong> {observation.targets}</p>
                                    <p><strong>Location:</strong> {observation.location}</p>
                                    <p><strong>Observation Time:</strong> {observation.observation_time}</p>
                                    {/* <p><strong>Sky Conditions:</strong> {observation.sky_conditions}</p> */}
                                    {/* <p><strong>Equipment:</strong> {observation.equipment.join(', ')}</p> */}
                                    <p><strong>Personal Observations:</strong> {observation.personal_observations}</p>
                                    {/* <p><strong>Privacy:</strong>{observation.privacy === 1 ? "Private" : "Public"}</p> */}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="right-column">
                <h2>Discover new people</h2>
                {usersData.slice(Math.ceil(usersData.length / 2)).map((userData, index) => (
                    <div key={index} className="user-card">
                        <p className="username"><a onClick={() => redirectToUserProfile(userData.username)}>{userData.username}</a></p>
                        <p>{userData.email}</p>
                        <button onClick={() => handleButtonClick(userData.id, userData.following)}>{userData.following ? "Unfollow" : "Follow"}</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiscoverPeople;
