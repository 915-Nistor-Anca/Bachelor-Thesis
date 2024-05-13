import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const FriendPage = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [observations, setObservations] = useState([]);
    const [skyConditionsMap, setSkyConditionsMap] = useState({});
    const [equipmentMap, setEquipmentMap] = useState({});
    const [followers, setFollowers] = useState([]);
    const [following, setFollowingUsers] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/polaris/get-user-id/${username}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data.');
                }
                const userData = await response.json();
                setUserData(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);


    return (
        <div>
            <h1>User Profile</h1>
            {userData && (
                <div>
                    <p><strong>Username:</strong> {userData.username}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                </div>
            )}
        </div>
    );
};

export default FriendPage;
