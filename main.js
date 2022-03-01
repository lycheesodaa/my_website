import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';
import gsap from 'gsap';

// -- gui stuff --
// const gui = new dat.GUI();
// console.log(gui);
const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegments: 50,
    heightSegments: 50,
  }
}

function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  )

  // randomizing vertex values
  // console.log(planeMesh.geometry.attributes.position.array);
  const { array } = planeMesh.geometry.attributes.position;
  const randomValues = [];
  for (let i = 0; i < array.length; i++) {

    if (i % 3 == 0) {
      array[i] += (Math.random() - 0.5) * 4;
      array[i + 1] += (Math.random() - 0.5) * 4;
      array[i + 2] += (Math.random() - 0.5) * 4;
    }

    randomValues.push(Math.random() * Math.PI * 2);
  }
  planeMesh.geometry.attributes.position.randomValues = randomValues;
  planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array;

  const colors = [];
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.3, 0.3);
  }

  // Float32Array() contains [r, g, b] values normalized to 1
  planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
}

// gui.add(world.plane, 'width', 300, 500, 1).onChange(generatePlane);
// gui.add(world.plane, 'height', 300, 500, 1).onChange(generatePlane);
// gui.add(world.plane, 'widthSegments', 30, 70, 1).onChange(generatePlane);
// gui.add(world.plane, 'heightSegments', 30, 70, 1).onChange(generatePlane);
// -- end of gui stuff --


// -- three.js stuff --
const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
// console.log(scene);
// console.log(camera);
// console.log(renderer);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
camera.translateZ(50);

// instantiating the plane object
const planeGeometry = new THREE.PlaneGeometry(
  world.plane.width,
  world.plane.height,
  world.plane.widthSegments,
  world.plane.heightSegments
);
const planeMaterial = new THREE.MeshPhongMaterial({
  // color: 0x024030,
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true,
})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

generatePlane();

scene.add(planeMesh);

// adding light parameters on both sides of the plane
const light = new THREE.DirectionalLight();
const backlight = new THREE.DirectionalLight();
light.position.set(0, 7, 6);
backlight.position.set(0, 2, -5);
scene.add(light);
scene.add(backlight);

const mouse = {
  x: undefined,
  y: undefined
}

// animations
let frame = 0;
function animate() {
  requestAnimationFrame(animate);
  frame += 0.01;
  renderer.render(scene, camera);
  // planeMesh.rotateZ(0.001);
  raycaster.setFromCamera(mouse, camera);

  const { array, originalPosition, randomValues } = planeMesh.geometry.attributes.position
  for (let i = 0; i < array.length; i += 3) {
    // x
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.002;
    // y
    array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i]) * 0.002;
  }

  planeMesh.geometry.attributes.position.needsUpdate = true;

  const intersects = raycaster.intersectObject(planeMesh);
  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes;
    // console.log(intersects[0].object.geometry.attributes.color);

    // setting the three vertex colors of the triangle we're hovering over
    color.setX(intersects[0].face.a, 0);
    color.setY(intersects[0].face.a, 0.6);
    color.setZ(intersects[0].face.a, 0.6);

    color.setX(intersects[0].face.b, 0);
    color.setY(intersects[0].face.b, 0.6);
    color.setZ(intersects[0].face.b, 0.6);

    color.setX(intersects[0].face.c, 0);
    color.setY(intersects[0].face.c, 0.6);
    color.setZ(intersects[0].face.c, 0.6);

    color.needsUpdate = true;

    const initialColor = {
      r: 0,
      g: 0.3,
      b: 0.3
    }
    const hoverColor = {
      r: 0,
      g: 0.6,
      b: 0.6
    }

    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      duration: 1,
      onUpdate: () => {
        color.setX(intersects[0].face.a, hoverColor.r);
        color.setY(intersects[0].face.a, hoverColor.g);
        color.setZ(intersects[0].face.a, hoverColor.b);

        color.setX(intersects[0].face.b, hoverColor.r);
        color.setY(intersects[0].face.b, hoverColor.g);
        color.setZ(intersects[0].face.b, hoverColor.b);

        color.setX(intersects[0].face.c, hoverColor.r);
        color.setY(intersects[0].face.c, hoverColor.g);
        color.setZ(intersects[0].face.c, hoverColor.b);

        color.needsUpdate = true;
      }
    })
  }
}

animate();

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / innerHeight) * 2 + 1;
  // console.log(mouse);
})