import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CommunityPage = () => {
    const navigate = useNavigate();
    const [followingUsers, setFollowingUsers] = useState([]);

    const getUserIdFromCookie = () => {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
        const userCookie = cookies.find(cookie => cookie[0] === 'user_id');
        return userCookie ? userCookie[1] : null;
    };
    
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
                console.log(followingUsers);


                for(const user_id of data.following){
                    console.log(user_id);
                    const response2 = await fetch(`http://127.0.0.1:8000/polaris/observations-user/${user_id}`);
                    if (!response2.ok) {
                        throw new Error('Failed to fetch observations of a user.');
                    }
                    const data = await response2.json();
                    console.log(data);
                }

            } catch (error) {
                console.error('Error fetching following users:', error);
            }
        };

        fetchFollowingUsers();
    }, [navigate]);

    return (
        <div>
            {followingUsers.map(user => (
                <div key={user.id}>
                    <h2>{user.username}</h2>
                    {/* Fetch the last observation for this user */}
                    {/* You can create a separate component for rendering observations */}
                    {/* and pass user.id as a prop */}
                </div>
            ))}
        </div>
    );
};

export default CommunityPage;
