import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './EventImagesPage.css';

function EventImagesPage() {
  const { eventId } = useParams();
  const [images, setImages] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  const getUserIdFromCookie = () => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    const userCookie = cookies.find(cookie => cookie[0] === 'user_id');
    return userCookie ? userCookie[1] : null;
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/polaris/images/?event=${eventId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const imageData = await response.json();
        setImages(imageData);
        fetchUsernames(imageData);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    const fetchUsernames = async (imageData) => {
      const userIds = [...new Set(imageData.map(image => image.user))];
      const usernamesData = await Promise.all(userIds.map(async (userId) => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/polaris/users/${userId}/`);
          if (!response.ok) {
            throw new Error(`Failed to fetch user data for user ID: ${userId}`);
          }
          const userData = await response.json();
          return { userId, username: userData.username };
        } catch (error) {
          console.error(`Error fetching user data for user ID: ${userId}`, error);
          return { userId, username: 'Unknown' };
        }
      }));

      const usernamesMap = Object.fromEntries(usernamesData.map(({ userId, username }) => [userId, username]));
      setUsernames(usernamesMap);
    };

    fetchImages();
  }, [eventId]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    const userId = getUserIdFromCookie();
    if (!userId) {
      alert('User ID not found in cookies');
      return;
    }

    const formData = {image: selectedFile, event: eventId, user: userId};
    // formData.append('image', selectedFile);
    // formData.append('event', eventId);
    // formData.append('user', userId);

    try {
      console.log(formData);
      const response = await fetch('http://127.0.0.1:8000/polaris/images/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const newImage = await response.json();
      setImages((prevImages) => [...prevImages, newImage]);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="event-images-page">
      <h1>Discover the images made at the event!</h1>

      <div className="images-container">
        {images.length > 0 ? (
          images.map(image => (
            <div key={image.id} className="image-card">
              <img src={image.image.replace('/media', '')} alt={image.title} className="event-image" />
              <p className="image-username"><strong>Username:</strong> {usernames[image.user]}</p>
            </div>
          ))
        ) : (
          <p>No images available.</p>
        )}
      </div>
      <form onSubmit={handleUpload} className="upload-form">
        <input className="choose-file" type="file" onChange={handleFileChange} />
        <button type="submit">Upload Image</button>
      </form>
    </div>
  );
}

export default EventImagesPage;
