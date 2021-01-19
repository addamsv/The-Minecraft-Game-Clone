import * as THREE from 'three';
import * as SimplexNoise from 'simplex-noise';
// eslint-disable-next-line
import MapWorker from 'worker-loader!./worker';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import PointerLock from '../controllers/pointerLock/pointerLock';
import PointerLockInterface from '../controllers/pointerLock/pointerLockInterface';
import MainModelInterface from './mainModelInterface';
import settingsConfig from '../configs/settingsConfig';
import Stats from '../controllers/pointerLock/stats.js';

class GameModel {
  stats: any;

  currentChunk: {
    x: number,
    z: number,
  }

  camera: THREE.PerspectiveCamera;

  scene: THREE.Scene;

  renderer: THREE.WebGLRenderer;

  raycaster: THREE.Raycaster;

  time: number;

  speed: THREE.Vector3;

  direction: THREE.Vector3;

  forward: boolean;

  left: boolean;

  backward: boolean;

  right: boolean;

  jump: boolean;

  control: PointerLockInterface;

  perlin: SimplexNoise;

  renderDistance: number;

  chunkSize: number;

  meshes: any;

  model: MainModelInterface;

  lastPing: number;

  ambientLight: THREE.AmbientLight;

  directionalLight: THREE.DirectionalLight;

  pointLight: THREE.PointLight;

  night: boolean;

  lastChange: number;

  worker: Worker;

  workerInterval: any;

  mapSeed: string;

  constructor(model: MainModelInterface) {
    this.model = model;
    this.forward = false;
    this.left = false;
    this.backward = false;
    this.right = false;
    this.jump = false;
    this.perlin = new SimplexNoise();
    this.meshes = {};
    this.renderDistance = 6;
    this.chunkSize = 16;
    this.createScene();
    this.night = false;
  }

  createScene() {
    this.camera = new THREE.PerspectiveCamera(
      Number(settingsConfig.fov.cur),
      window.innerWidth / window.innerHeight,
      1,
      Number(settingsConfig.far.cur),
    );
    this.control = new PointerLock(this.camera, document.body);

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.domElement.classList.add('renderer');
  }

  generateWorld() {
    this.stats = Stats();
    this.stats.showPanel(0);

    this.raycaster = new THREE.Raycaster(
      new THREE.Vector3(),
      new THREE.Vector3(0, -1, 0), 0, 20,
    );

    this.time = performance.now();
    this.speed = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    this.camera.position.y = 200;
    this.camera.position.x = (this.chunkSize / 2) * 10;
    this.camera.position.z = (this.chunkSize / 2) * 10;

    this.currentChunk = {
      x: 0,
      z: 0,
    };

    this.worker = new MapWorker();

    const texture = new THREE.TextureLoader().load('../assets/textures/earth.png');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    const sandTexture = new THREE.TextureLoader().load('../assets/textures/sand.png');
    sandTexture.magFilter = THREE.NearestFilter;
    sandTexture.minFilter = THREE.LinearMipmapLinearFilter;

    const loader = new GLTFLoader();
    let tree: THREE.Object3D;
    loader.load(
      './assets/meshes/oak1.glb',
      (gltf: any) => {
        tree = gltf.scene;
        tree.traverse((node: THREE.Mesh) => {
          // eslint-disable-next-line
          node.receiveShadow = true;
        });
        tree.scale.set(15, 15, 15);
      },
    );

    const material = new THREE.MeshLambertMaterial(
      { map: texture, side: THREE.DoubleSide },
    );
    const sandMaterial = new THREE.MeshLambertMaterial(
      { map: sandTexture, side: THREE.DoubleSide },
    );
    const waterMaterial = new THREE.MeshLambertMaterial();
    waterMaterial.color = new THREE.Color(0x4980A2);

    waterMaterial.transparent = true;
    waterMaterial.opacity = 0.5;

    this.worker.onmessage = (event: any) => {
      setTimeout(() => {
        if (event.data.map) {
          this.mapSeed = event.data.seed;
          this.model.setSeed(this.mapSeed);
        }

        const {
          geometry, sandGeometry, waterGeometry, xChunk, zChunk,
        } = event.data;
        if (!this.meshes[`${xChunk}:${zChunk}`]) {
          this.meshes[`${xChunk}:${zChunk}`] = {
            obj: null,
            hasObj: false,
            group: new THREE.Group(),
            hasGroup: false,
            sand: null,
            water: null,
            markForRemoval: false,
            x: xChunk,
            z: zChunk,
          };
        }
        const meshMemo = this.meshes[`${xChunk}:${zChunk}`];

        if (event.data.add) {
          const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
          const sandBufferGeometry = new THREE.BufferGeometry().fromGeometry(sandGeometry);
          const waterBufferGeometry = new THREE.BufferGeometry().fromGeometry(waterGeometry);

          const mesh = new THREE.Mesh(bufferGeometry, material);
          mesh.receiveShadow = true;
          mesh.position.setX(xChunk * this.chunkSize * 10);
          mesh.position.setZ(zChunk * this.chunkSize * 10);

          const sandMesh = new THREE.Mesh(sandBufferGeometry, sandMaterial);
          sandMesh.receiveShadow = true;
          sandMesh.position.setX(xChunk * this.chunkSize * 10);
          sandMesh.position.setZ(zChunk * this.chunkSize * 10);

          const water = new THREE.Mesh(waterBufferGeometry, waterMaterial);
          water.receiveShadow = true;
          water.position.setX(xChunk * this.chunkSize * 10);
          water.position.setZ(zChunk * this.chunkSize * 10);
          water.name = 'water';

          meshMemo.obj = mesh;
          meshMemo.hasObj = true;
          meshMemo.sand = sandMesh;
          meshMemo.water = water;
          if (!meshMemo.markForRemoval) {
            this.scene.add(mesh);
            this.scene.add(sandMesh);
            this.scene.add(water);
          }
          meshMemo.markForRemoval = false;
        }

        if (event.data.remove) {
          meshMemo.markForRemoval = true;
          if (meshMemo.hasObj) {
            this.scene.remove(meshMemo.obj);
            this.scene.remove(meshMemo.sand);
            this.scene.remove(meshMemo.water);
            this.scene.remove(meshMemo.group);
            meshMemo.markForRemoval = false;
          }
        }

        if (event.data.tree) {
          const treeClone = tree.clone(true);
          treeClone.rotation.y = Math.PI / Math.random();
          treeClone.position.x = event.data.x;
          treeClone.position.z = event.data.z;
          if (!meshMemo.hasGroup) {
            meshMemo.group.add(treeClone);
          }
          if (event.data.last) {
            meshMemo.hasGroup = true;
          }
          if (event.data.last && !meshMemo.markForRemoval) {
            this.scene.add(meshMemo.group);
            meshMemo.group.position.setX(xChunk * this.chunkSize * 10);
            meshMemo.group.position.setZ(zChunk * this.chunkSize * 10);
          }
        }
      }, 0);
    };

    this.worker.postMessage({ xChunk: 0, zChunk: 0, load: true });

    // set day fog
    this.scene.fog = new THREE.FogExp2(0xffffff, 0.001);
    // set day sky
    this.scene.background = new THREE.Color(0x87CEEB);
    // set day light
    this.ambientLight = new THREE.AmbientLight(0xcccccc);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
    this.directionalLight.position.set(1, 1, 0.5).normalize();
    this.scene.add(this.directionalLight);

    // set night light
    this.pointLight = new THREE.PointLight(0xFAEBA3, 2);
    this.pointLight.castShadow = true;
    this.pointLight.shadow.camera.far = 100;
  }

  changeLight() {
    this.night = !this.night;
    if (this.night) {
      // sky
      this.scene.fog = new THREE.FogExp2(0x000000, 0.001);
      this.scene.background = new THREE.Color(0x000000);

      // ambient
      this.scene.remove(this.ambientLight);
      this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
      this.scene.add(this.ambientLight);

      this.scene.remove(this.directionalLight);
      this.scene.add(this.pointLight);
    } else {
      this.scene.fog = new THREE.FogExp2(0xffffff, 0.001);
      this.scene.background = new THREE.Color(0x87CEEB);

      this.scene.remove(this.ambientLight);
      this.ambientLight = new THREE.AmbientLight(0xcccccc);
      this.scene.add(this.ambientLight);

      this.scene.remove(this.pointLight);
      this.scene.add(this.directionalLight);
    }
  }

  animationFrame() {
    this.stats.begin();
    this.jump = false;
    const time = performance.now();

    // how often should send to the server
    const period = 1000; // in ms

    // send player coordinates to the server
    const pingTime = Math.trunc(time / period);
    if (this.model.handshake && this.lastPing !== pingTime) {
      this.lastPing = pingTime;

      this.model.sendHeroCoordinates(
        String(Math.trunc(this.camera.position.x / 10)),
        String(Math.trunc(this.camera.position.y / 10)),
      );
    }

    // check time to update light
    const dayLength = 100000; // in ms
    const dayTime = Math.trunc(time / dayLength);
    if (dayTime && dayTime !== this.lastChange) {
      this.lastChange = dayTime;
      this.changeLight();
    }

    // check position to update map
    let newChunkX = this.camera.position.x / 10 / this.chunkSize;
    let newChunkZ = this.camera.position.z / 10 / this.chunkSize;
    if (newChunkX < 0) newChunkX -= 1;
    if (newChunkZ < 0) newChunkZ -= 1;
    newChunkX = Math.trunc(newChunkX);
    newChunkZ = Math.trunc(newChunkZ);
    if (newChunkX !== this.currentChunk.x || newChunkZ !== this.currentChunk.z) {
      this.worker.postMessage(
        {
          oldChunkX: this.currentChunk.x,
          oldChunkZ: this.currentChunk.z,
          newChunkX,
          newChunkZ,
          update: true,
        },
      );
      this.currentChunk.x = newChunkX;
      this.currentChunk.z = newChunkZ;
    }
    if (this.control.isLocked) {
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

      // falling
      this.raycaster.ray.origin.copy(this.camera.position);
      const falling = this.raycaster.intersectObjects(this.scene.children);
      let up = 15;
      if (falling.length) {
        if (falling[0].object.name === 'water') {
          this.raycaster.far = 5;
          this.control.SPEED = 1;
          up = 2.5;
        } else {
          this.raycaster.far = 20;
          this.control.SPEED = 2;
          up = 15;
        }
        this.speed.y = Math.max(0, this.speed.y);
        this.jump = true;
        if (falling[0].distance < up) {
          this.speed.z = 0;
          this.speed.x = 0;
          this.speed.y += 20;
        }
      }

      // if player fall down under textures
      if (this.camera.position.y < -300) {
        this.camera.position.y = 300;
        this.speed.y = 0;
      }

      this.control.moveRight(-this.speed.x * delta);
      this.control.moveForward(-this.speed.z * delta);
      this.camera.position.y += (this.speed.y * delta);

      // pointLight follow camera
      this.pointLight.position.x = this.camera.position.x;
      this.pointLight.position.y = this.camera.position.y;
      this.pointLight.position.z = this.camera.position.z;
    }
    this.time = time;
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
    requestAnimationFrame(this.animationFrame.bind(this));
  }
}

export default GameModel;
