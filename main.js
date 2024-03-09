import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const stars = [];

function createStar() {
    const geometry = new THREE.SphereGeometry(0.05, 8, 8);
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

function createPlanet(size, color, position) {
    const geometry = new THREE.SphereGeometry(40*size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: color });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.copy(position);
    scene.add(planet);
}

// Sun
createPlanet(0.2, 0xFF8C00, new THREE.Vector3(10, 0, 0));

// Mercury
createPlanet(0.08504, 0x9e9e9e, new THREE.Vector3(-2*4, 0, 0));

// Venus
createPlanet(0.08691, 0x0000ff, new THREE.Vector3(-4*4, 0, 0));

// Earth
createPlanet(0.08691, 0x00ff00, new THREE.Vector3(-6*4, 0, 0));

// Mars
createPlanet(0.04868, 0xff0000, new THREE.Vector3(-8*4, 0, 0));

// Jupiter
createPlanet(0.100398, 0xffa500, new THREE.Vector3(-10*4, 0, 0));

// Saturn
createPlanet(0.083626, 0xffd700, new THREE.Vector3(-12*4, 0, 0));

// Uranus
createPlanet(0.036422, 0xADD8E6, new THREE.Vector3(-14*4, 0, 0));

// Neptune
createPlanet(0.035359, 0x0000ff, new THREE.Vector3(-16*4, 0, 0));


// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // White directional light
directionalLight.position.set(5, 5, 5); // Position the light source
scene.add(directionalLight);

camera.position.z = 5;

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
    // Zoom in or out based on the direction of mouse wheel
    camera.position.z += event.deltaY * 0.1;
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

document.addEventListener('mousemove', onMouseMove, false);
document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mouseup', onMouseUp, false);
document.addEventListener('wheel', onWheel, false); // Add wheel event listener for zooming

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
