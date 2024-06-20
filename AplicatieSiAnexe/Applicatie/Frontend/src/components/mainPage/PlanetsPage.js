import { useEffect } from 'react';
import * as THREE from 'three';

function Planets () {
    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const stars = [];

        function createStar() {
            const geometry = new THREE.SphereGeometry(0.5, 8, 8);
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const star = new THREE.Mesh(geometry, material);

            star.position.set(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100
            );

            scene.add(star);
            stars.push(star);
        }

        for (let i = 0; i < 100; i++) {
            createStar();
        }

        function createPlanet(size, color, position, texturePath = null) {
            const geometry = new THREE.SphereGeometry(size, 32, 32);
            let material;

            if (texturePath) {
                const textureLoader = new THREE.TextureLoader();
                const texture = textureLoader.load(texturePath);
                material = new THREE.MeshStandardMaterial({ map: texture });
            } else {
                material = new THREE.MeshStandardMaterial({ color: color });
            }

            const planet = new THREE.Mesh(geometry, material);
            planet.position.copy(position);
            scene.add(planet);
            console.log(size);
            return planet;
        }

        // Sun
        createPlanet(109.1, 0xFF8C00, new THREE.Vector3(0, 0, 0), 'images/sun.jpg');

        // Mercury
        let mercury = createPlanet(0.38, 0x9e9e9e, new THREE.Vector3(0.387 * 10 + 110, 0, 0), 'images/mercury.jpg');

        // Venus
        let venus = createPlanet(0.96, 0x0000ff, new THREE.Vector3(0.723 * 10 + 110, 0, 0), 'images/venus.jpg');

        // Earth
        let earth = createPlanet(1.00, 0x00ff00, new THREE.Vector3(1.000 * 10 + 110, 0, 0), 'images/earth.jpg');

        // Mars
        let mars = createPlanet(0.53, 0xff0000, new THREE.Vector3(1.524 * 10 + 110, 0, 0), 'images/mars.jpg');

        // Jupiter
        let jupiter = createPlanet(10.94, 0xffa500, new THREE.Vector3(5.203 * 10 + 110, 0, 0), 'images/jupiter.jpg');

        // Saturn
        let saturn = createPlanet(9.06, 0xffd700, new THREE.Vector3(9.539 * 10 + 110, 0, 0), 'images/saturn.jpg');

        const ringTexture = new THREE.TextureLoader().load('images/ring.png');
        const ringMaterial = new THREE.MeshBasicMaterial({ map: ringTexture, side: THREE.DoubleSide });
        const ringGeometry = new THREE.RingGeometry(15, 12, 60);
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(9.539 * 10 + 110, 0, 0);
        scene.add(ring);

        // Uranus
        let uranus = createPlanet(3.78, 0xADD8E6, new THREE.Vector3(19.191 * 10 + 110, 0, 0), 'images/uranus.jpg');

        // Neptune
        let neptune = createPlanet(3.59, 0x0000ff, new THREE.Vector3(30.071 * 10 + 110, 0, 0), 'images/neptune.jpg');


        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 0, 0);
        scene.add(directionalLight);

        camera.position.z = 200;

        let isDragging = false;
        let previousMousePosition = {
            x: 0,
            y: 0
        };

        function onMouseMove(event) {
            const deltaMove = {
                x: event.clientX - previousMousePosition.x,
                y: event.clientY - previousMousePosition.y
            };

            if (isDragging) {
                const deltaRotationQuaternion = new THREE.Quaternion()
                    .setFromEuler(new THREE.Euler(
                        toRadians(deltaMove.y * 1),
                        toRadians(deltaMove.x * 1),
                        0,
                        'XYZ'
                    ));

                scene.quaternion.multiplyQuaternions(deltaRotationQuaternion, scene.quaternion);
            }

            previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
        }

        function onMouseDown(event) {
            isDragging = true;
        }

        function onMouseUp(event) {
            isDragging = false;
        }

        function onWheel(event) {
            camera.position.z += event.deltaY * 0.1;
        }

        function toRadians(angle) {
            return angle * (Math.PI / 180);
        }

        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('mousedown', onMouseDown, false);
        document.addEventListener('mouseup', onMouseUp, false);
        document.addEventListener('wheel', onWheel, false);

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }

        animate();

        function rotatePlanetAroundSun(planet, daysFullRotation, initialPositioning) {
            let rotationAngle = 0;
            const orbitalRadius = initialPositioning * 10 + 110;

            function updatePosition() {
                rotationAngle += (2 * Math.PI / daysFullRotation);

                const X = orbitalRadius * Math.cos(rotationAngle);
                const Z = orbitalRadius * Math.sin(rotationAngle);

                planet.position.set(X, 0, Z);

                requestAnimationFrame(updatePosition);
            }

            updatePosition();
        }

        rotatePlanetAroundSun(mercury, 88, 0.387);
        rotatePlanetAroundSun(venus, 225, 0.723);
        rotatePlanetAroundSun(earth, 365, 1.000);
        rotatePlanetAroundSun(mars, 687, 1.524);
        rotatePlanetAroundSun(jupiter,  4331, 5.203);
        rotatePlanetAroundSun(saturn, 10747, 9.539);
        rotatePlanetAroundSun(ring, 10747, 9.539)
        rotatePlanetAroundSun(uranus, 30589, 19.191);
        rotatePlanetAroundSun(neptune, 59800, 30.071);
    }, []);

    return null;
};

export default Planets;

