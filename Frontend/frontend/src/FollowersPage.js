import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FollowersPage = () => {
    const navigate = useNavigate();
    const [followersUsers, setFollowersUsers] = useState([]);
    const [followingUsers, setFollowingUsers] = useState([]);
    const [usersData, setUsersData] = useState([]);

    const getUserIdFromCookie = () => {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
        const userCookie = cookies.find(cookie => cookie[0] === 'user_id');
        return userCookie ? userCookie[1] : null;
    };
    

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = getUserIdFromCookie();
                if (!userId) {
                    console.error('User ID cookie not found');
                    navigate('/login');
                    return;
                }

                const response1 = await fetch(`http://127.0.0.1:8000/polaris/get-followers/${userId}`);
                if (!response1.ok) {
                    throw new Error('Failed to fetch followers users.');
                }
                const followersData = await response1.json();
                setFollowersUsers(followersData.followers);

                const response2 = await fetch(`http://127.0.0.1:8000/polaris/userprofiles/${userId}`);
                if (!response2.ok) {
                    throw new Error('Failed to fetch following users.');
                }
                const followingData = await response2.json();
                setFollowingUsers(followingData.following);

                const followersUserDataPromises = followersData.followers.map(async user_id => {
                    const response = await fetch(`http://127.0.0.1:8000/polaris/users/${user_id}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch user.');
                    }
                    return response.json();
                });

                const followersUsersData = await Promise.all(followersUserDataPromises);
                
                setUsersData(followersUsersData);

                const followingIds = new Set(followingData.following);
                setUsersData(followersUsersData.map(user => ({
                    ...user,
                    following: followingIds.has(user.id) 
                })));
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleButtonClick = () => {
    };

    return (
        <div>
            <h1>Followers</h1>
            <ul>
                {usersData.map((userData, index) => (
                    <li key={index}>
                        <strong>Username:</strong> {userData.username}, <strong>Email:</strong> {userData.email}
                        <button onClick={() => handleButtonClick(userData.id, userData.following)}>
                            {userData.following ? "Unfollow" : "Follow"}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FollowersPage;
