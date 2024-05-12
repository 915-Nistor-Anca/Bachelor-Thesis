import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FollowingPage = () => {
    const navigate = useNavigate();
    const [followingUsers, setFollowingUsers] = useState([]);

    const getUserIdFromCookie = () => {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
        const userCookie = cookies.find(cookie => cookie[0] === 'user_id');
        return userCookie ? userCookie[1] : null;
    };

    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
        const fetchFollowingUsers = async () => {
            const userId = getUserIdFromCookie();
            if (!userId) {
                console.error('User ID cookie not found');
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/polaris/userprofiles/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch following users.');
                }
                const data = await response.json();
                setFollowingUsers(data.following);

                const userDataPromises = data.following.map(async user_id => {
                    const response2 = await fetch(`http://127.0.0.1:8000/polaris/users/${user_id}`);
                    if (!response2.ok) {
                        throw new Error('Failed to fetch user.');
                    }
                    return response2.json();
                });

                const usersData = await Promise.all(userDataPromises);
                setUsersData(usersData);
            } catch (error) {
                console.error('Error fetching following users:', error);
            }
        };

        fetchFollowingUsers();
    }, []);

    return (
        <div>
            <h1>Following</h1>
            <ul>
                {usersData.map((userData, index) => (
                    <li key={index}>
                        <strong>Username:</strong> {userData.username}, <strong>Email:</strong> {userData.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FollowingPage;
