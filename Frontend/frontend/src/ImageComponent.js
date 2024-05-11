import React, { useState, useEffect } from 'react';

function ImageComponent() {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        async function fetchImage() {
            try {
                const response = await fetch('http://127.0.0.1:8000/polaris/images/img1.jpeg');
                if (!response.ok) {
                    throw new Error('Failed to fetch image');
                }
                // Set the image URL directly, as we're fetching the image, not JSON data
                setImageUrl(response.url);
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        }

        fetchImage();
    }, []);

    return (
        <div>
            {imageUrl && <img src={imageUrl} alt="Uploaded picture" />}
        </div>
    );
}

export default ImageComponent;
