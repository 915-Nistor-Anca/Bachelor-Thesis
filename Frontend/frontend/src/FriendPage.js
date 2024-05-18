import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import astronomerFriend from './astronomer-friend.jpeg';
import './ProfilePage.css'; 

const FriendPage = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState({ username: username, email: '', id: null });
    const [observations, setObservations] = useState([]);
    const [skyConditionsMap, setSkyConditionsMap] = useState({});
    const [equipmentMap, setEquipmentMap] = useState({});
    const [followers, setFollowers] = useState([]);
    const [following, setFollowingUsers] = useState([]);
    const [showStatistics, setShowStatistics] = useState(false);
    const [observationsNumber, setObservationsNumber] = useState('');
    const navigate = useNavigate();

    const handleStatisticsClick = () => {
        setShowStatistics(!showStatistics);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/polaris/get-user-id/${username}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data.');
                }
                const userData2 = await response.json();
                setUserData(userData2);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [username]);

    useEffect(() => {
        if (!userData.id) return;

        const fetchObservations = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/polaris/observations-user/${userData.id}/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user observations.');
                }
                const data = await response.json();
                setObservationsNumber(data.length);
                setObservations(data);

                const uniqueSkyConditionIds = new Set(data.map(observation => observation.sky_conditions));
                const uniqueEquipmentIds = new Set(data.flatMap(observation => observation.equipment));

                const skyConditions = {};
                for (const id of uniqueSkyConditionIds) {
                    const skyConditionResponse = await fetch(`http://127.0.0.1:8000/polaris/skyconditions/${id}/`);
                    if (!skyConditionResponse.ok) {
                        console.error(`Failed to fetch sky condition with ID ${id}`);
                        continue;
                    }
                    const skyConditionData = await skyConditionResponse.json();
                    skyConditions[id] = skyConditionData.name;
                }
                setSkyConditionsMap(skyConditions);

                const equipment = {};
                for (const id of uniqueEquipmentIds) {
                    const equipmentResponse = await fetch(`http://127.0.0.1:8000/polaris/equipments/${id}/`);
                    if (!equipmentResponse.ok) {
                        console.error(`Failed to fetch equipment with ID ${id}`);
                        continue;
                    }
                    const equipmentData = await equipmentResponse.json();
                    equipment[id] = equipmentData.name;
                }
                setEquipmentMap(equipment);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchObservations();
    }, [userData]);

    useEffect(() => {
        if (!userData.id) return;

        const fetchFollowingUsers = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/polaris/userprofiles/${userData.id}`);
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
    }, [userData]);

    useEffect(() => {
        if (!userData.id) return;

        const fetchFollowers = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/polaris/get-followers/${userData.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch followers.');
                }
                const data = await response.json();
                setFollowers(data.followers);
            } catch (error) {
                console.error('Error fetching followers:', error);
            }
        };

        fetchFollowers();
    }, [userData]);

    const lastThreeObservations = observations.filter(observation => observation.privacy === 0);

    const redirectToFollowers = (username) => {
        navigate(`/followers/${username}`);
    };

    const redirectToFollowing = (username) => {
        navigate(`/following/${username}`);
    };

    return (
        <div className='all-profile-page'>
            <div className="profile-container">
                <div className='first-part'>
                    {userData && (
                        <React.Fragment>
                            <div className="profile-image-container">
                                <img src={astronomerFriend} className="profile-image" alt="Profile" />
                            </div>
                            <div>
                                <h1 className="title">{userData.username}</h1>
                            </div>
                            <div>
                                <p className="text"> {userData.email}</p>
                                <button className="button" onClick={handleStatisticsClick}>Statistics</button>
                                {showStatistics && (
                                    <div className="statistics">
                                        <h2>Statistics</h2>
                                        <p>Number of observations: {observationsNumber}</p>
                                        <a onClick={() => redirectToFollowers(userData.username)}>Followers: {followers.length}; </a>
                                        {/* <p><Link to="/following">Following: {following.length}</Link></p> */}
                                        <a onClick={() => redirectToFollowing(userData.username)}>Following: {following.length}</a>
                                    </div>
                                )}
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </div>
            <div className='ObservationsPage'>
                <div className="observation-list">
                    {lastThreeObservations.map(observation => (
                        <div className="observation" key={observation.id}>
                            <div className="observation-content">
                                <p><strong>Targets:</strong> {observation.targets}</p>
                                <p><strong>Location:</strong> {observation.location}</p>
                                <p><strong>Observation Time:</strong> {observation.observation_time}</p>
                                <p><strong>Sky Conditions:</strong> {skyConditionsMap[observation.sky_conditions]}</p>
                                <p><strong>Equipment:</strong> {observation.equipment.map(id => equipmentMap[id]).join(', ')}</p>
                                <p><strong>Personal Observations:</strong> {observation.personal_observations}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='all-observations-text'><Link to="/observationspage">See all observations</Link></div>
        </div>
    );
};

export default FriendPage;
