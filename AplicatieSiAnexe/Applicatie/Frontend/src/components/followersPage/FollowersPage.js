import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "./FollowersPage.css";

const FollowersPage = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [followersUsers, setFollowersUsers] = useState([]);
    const [followingUsers, setFollowingUsers] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loggedInUserId, setLoggedInUserId] = useState(null);

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
        const fetchUserId = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/polaris/get-user-id/${username}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user ID.');
                }
                const data = await response.json();
                setUserId(data.id);
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        fetchUserId();
    }, [username, navigate]);


    

    useEffect(() => {
        if (!userId) return;

        const fetchUserData = async () => {
            try {
                const loggedInUserId = getUserIdFromCookie();
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
    }, [userId]);

    const handleButtonClick = async (userId, following) => {
        try {
            const loggedInUserId = getUserIdFromCookie();
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
        <div className="following-page">
            <h1>Followers</h1>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Follow/Unfollow</th>
                    </tr>
                </thead>
                <tbody>
                    {usersData.map((userData, index) => (
                        <tr key={index}>
                            <td>
                                <a onClick={() => redirectToUserProfile(userData.username)}>{userData.username}</a>
                            </td>
                            <td>{userData.email}</td>
                            <td>
                                <button onClick={() => handleButtonClick(userData.id, userData.following)}>{userData.following ? "Unfollow" : "Follow"}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FollowersPage;
