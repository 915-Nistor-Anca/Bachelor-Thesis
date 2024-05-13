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
                console.log(followersUsersData);

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

    const handleButtonClick = async (userId, following) => {
        try {
            console.log("following:", following);
            const currentUserId = getUserIdFromCookie();
            console.log(currentUserId, userId);
            const endpoint = following ? `http://127.0.0.1:8000/polaris/unfollow/${currentUserId}/${userId}` : `http://127.0.0.1:8000/polaris/follow/${currentUserId}/${userId}`;
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
        <div>
            <h1>Followers</h1>
            <ul>
                {usersData.map((userData, index) => (
                    <li key={index}>
                        <strong>Username:</strong> 
                        <a href="#" onClick={() => redirectToUserProfile(userData.username)}>{userData.username}</a>, 
                        <strong>Email:</strong> {userData.email}
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
