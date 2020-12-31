import * as THREE from 'three';
import * as SimplexNoise from 'simplex-noise';
import { PointerLockControls } from '../controllers/modules/pointerLockControls.js';

class GameView {
  camera: THREE.PerspectiveCamera;

  scene: THREE.Scene;

  renderer: THREE.WebGLRenderer;

  raycaster: THREE.Raycaster;

  time: number;

  speed: THREE.Vector3;

  direction: THREE.Vector3;

  collision: Array<THREE.Mesh>;

  forward: boolean;

  left: boolean;

  backward: boolean;

  right: boolean;

  jump: boolean;

  control: PointerLockControls;

  constructor() {
    this.forward = false;
    this.left = false;
    this.backward = false;
    this.right = false;
    this.jump = false;
  }

  createScene() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.y = 300;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.classList.add('renderer');

    this.scene.background = new THREE.Color(0x94D1CB);
    // this.scene.background = new THREE.CubeTextureLoader()
    //   .setPath('./assets/textures/sky/')
    //   .load([
    //     'side.png',
    //     'side.png',
    //     'up.png',
    //     'down.png',
    //     'side.png',
    //     'side.png',
    //   ]);
  }

  generateWorld() {
    this.raycaster = new THREE.Raycaster(
      new THREE.Vector3(),
      new THREE.Vector3(0, -1, 0), 0, 10,
    );

    this.time = performance.now();
    this.speed = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    this.collision = [];

    const loader = new THREE.TextureLoader().setPath('./assets/textures/blocks/');
    const materialArray = [
      new THREE.MeshBasicMaterial({ map: loader.load('grass_side.png') }),
      new THREE.MeshBasicMaterial({ map: loader.load('grass_side.png') }),
      new THREE.MeshBasicMaterial({ map: loader.load('grass_top.png') }),
      new THREE.MeshBasicMaterial({ map: loader.load('dirt.png') }),
      new THREE.MeshBasicMaterial({ map: loader.load('grass_side.png') }),
      new THREE.MeshBasicMaterial({ map: loader.load('grass_side.png') }),
    ];

    const chunkSize = 10;
    const renderDistance = 800;
    const geometry = new THREE.BoxGeometry(chunkSize, chunkSize, chunkSize);
    const simplex = new SimplexNoise();
    const instanceChunk = new THREE.InstancedMesh(geometry, materialArray,
      chunkSize * chunkSize * renderDistance);

    let count = 0;

    for (let x = -renderDistance; x < renderDistance; x += chunkSize) {
      for (let z = -renderDistance; z < renderDistance; z += chunkSize) {
        const y = 200 + Math.round(Math.round(simplex.noise2D(x / 500, z / 500) * 200)
          / chunkSize) * chunkSize;

        const matrix = new THREE.Matrix4().makeTranslation(x, y, z);

        instanceChunk.setMatrixAt(count, matrix);
        count += 1;
      }
    }

    this.scene.add(instanceChunk);

    this.collision.push(instanceChunk);
  }

  animationFrame() {
    this.jump = false;
    requestAnimationFrame(this.animationFrame.bind(this));
    const time = performance.now();
    if (this.control.isLocked === true) {
      this.raycaster.ray.origin.copy(this.camera.position);
      this.raycaster.ray.origin.y -= 15;
      const intersections = this.raycaster.intersectObjects(this.collision);
      const onObject = intersections.length > 0;

      const delta = (time - this.time) / 1000;
      this.speed.x -= this.speed.x * 10.0 * delta;
      this.speed.z -= this.speed.z * 10.0 * delta;
      this.speed.y -= 9.8 * 50.0 * delta;
      this.direction.z = Number(this.forward) - Number(this.backward);
      this.direction.x = Number(this.right) - Number(this.left);

      this.direction.normalize();
      if (this.forward || this.backward) {
        this.speed.z -= this.direction.z * 400.0 * delta;
      }
      if (this.left || this.right) {
        this.speed.x -= this.direction.x * 400.0 * delta;
      }

      if (onObject) {
        this.speed.y = Math.max(0, this.speed.y);
        this.jump = true;
      }

      const ray = new THREE.Vector3();
      const { x, y, z } = this.camera.position;
      ray.x = x; ray.y = y - 10; ray.z = z;
      this.raycaster.ray.origin.copy(ray);
      const wallCheck = this.raycaster.intersectObjects(this.collision);

      if (wallCheck.length) {
        this.speed.z = 0;
        this.speed.x = 0;
        this.speed.y += 30;
      }

      this.control.moveRight(-this.speed.x * delta);
      this.control.moveForward(-this.speed.z * delta);
      this.camera.position.y += (this.speed.y * delta);
    }
    this.time = time;
    this.renderer.render(this.scene, this.camera);
  }
}

export default GameView;
