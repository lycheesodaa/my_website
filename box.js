import * as THREE from 'three';

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00FF00})
// console.log(boxGeometry);
// console.log(material);

const mesh = new THREE.Mesh(boxGeometry, material);
// console.log(mesh);

scene.add(mesh);