import './style.css'

import * as THREE from 'three';

import {OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let duck;
let astronaut;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10,3,16,100)
//const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
//const torus = new THREE.Mesh(geometry, material);

const donutTexture = new THREE.TextureLoader().load('/images/donut.jpg');

const material = new THREE.MeshStandardMaterial({ map: donutTexture });

const torus = new THREE.Mesh(geometry, material);


scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(20, 10, 10);


const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(pointLight, ambientLight)

const testLight = new THREE.PointLight(0xffffff, 1, 100);
testLight.position.set(10, 0, 0); // Place near astronaut
scene.add(testLight);


///const lightHelper = new THREE.PointLightHelper(pointLight)
//const gridHelper = new THREE.GridHelper(200,50);
//scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);
  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star)
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('/images/space.jpg');
scene.background = spaceTexture;

const kinTexture = new THREE.TextureLoader().load('/images/kin_photo.jpg');

const kin = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: kinTexture }));

scene.add(kin);

const moonTexture = new THREE.TextureLoader().load('/images/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('/images/normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
   //metalness: 0.2,
    //roughness: 0.8,
  })
);
scene.add(moon);

//moon.position.set(-10, 0, 30); // move moon away from other objects and into light

moon.position.z = 30;
moon.position.setX(-10);

const gltfLoader = new GLTFLoader();

gltfLoader.load('/models/duck.glb',
  (gltf) => {
    duck = gltf.scene;
    duck.scale.set(10, 10, 10);
    duck.position.set(60, -20, -30);
    scene.add(duck);
  },
  undefined,
  (err) => console.error('Duck loading error:', err)
);

let rocket;

gltfLoader.load('/models/rocket.glb',
  (gltf) => {
    rocket = gltf.scene;
    rocket.scale.set(10,10,10);
    rocket.position.set(-50, 0, -10); // Start on the left

    rocket.rotation.x = -Math.PI / 3;
    rocket.rotation.z = -Math.PI / 2;
    //rocket.rotation.y = -Math.PI / 8;

    scene.add(rocket);
  },
  undefined,
  (err) => console.error('Rocket loading error:', err)
);

function moveCamera(){
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  if (duck) {
    duck.rotation.x += 0.05;
    duck.rotation.y += 0.05;
    //duck.rotation.z += 0.05;
  }

  if (rocket) {
    rocket.position.x = -50 + (t * -0.04); // Adjust multiplier for speed
  }

  kin.rotation.y += 0.01;
  kin.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera

function animate(){
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01; // 0.01
  torus.rotation.y += 0.005; // 0.005
  torus.rotation.z += 0.01; // 0.01

  if (astronaut) {
    astronaut.rotation.y += 0.01;
    astronaut.rotation.x += 0.005;
  }


  //moon.rotation.y += 0.002;

  controls.update();

  renderer.render(scene, camera);
}

animate();





// gltfLoader.load('/models/astronaut.glb', (gltf) => {
//   const astronaut = gltf.scene;
//   astronaut.position.set(10, 0, -5);
//   astronaut.rotation.y = Math.PI; // optional flip
//   scene.add(astronaut);

//   function animateAstronaut() {
//     requestAnimationFrame(animateAstronaut);
//     astronaut.rotation.y += 0.01; // auto-rotate
//   }

//   animateAstronaut();
// });