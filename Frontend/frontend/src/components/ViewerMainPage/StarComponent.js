import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const StarComponent = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Create stars
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });

    const starVertices = [];
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 200;
      const z = (Math.random() - 0.5) * 200;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Position camera
    camera.position.z = 5;

    // Animation function
    let animationFrameId;
    const animate = () => {
      // Rotate the stars
      stars.rotation.x += 0.001;
      stars.rotation.y += 0.001;

      // Render the scene
      renderer.render(scene, camera);

      // Request the next frame
      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Handle cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default StarComponent;
