import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "./FollowingPage.css";

const FollowingPage = () => {
    const navigate = useNavigate();
    const [followingUsers, setFollowingUsers] = useState([]);
    const { username } = useParams();
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [usersData, setUsersData] = useState([]);
    const [userId, setUserId] = useState(null);

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
    }, [username]);

    useEffect(() => {
        if (!userId) return;

        const fetchFollowingUsers = async () => {
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
                const followingIds = new Set(data.following);

                setUsersData(usersData.map(user => ({
                    ...user,
                    following: followingIds.has(user.id)
                })));
            } catch (error) {
                console.error('Error fetching following users:', error);
            }
        };

        fetchFollowingUsers();
    }, [userId]);

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
     <div className="following-page">
            <h1>Following</h1>
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

export default FollowingPage;
