import * as THREE from 'three';

interface game extends Object {
  world: any;
  display: any;
  player: any;
}

export function createScene() {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 20, 50);

  return {
    world: scene,
    display: renderer,
    player: camera,
  };
}

export function generateWorld(GAME: game) {
  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  GAME.world.add(cube);

  GAME.display.render(GAME.world, GAME.player);
}
