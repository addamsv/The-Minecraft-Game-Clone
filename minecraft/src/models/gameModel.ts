import * as THREE from 'three';
// eslint-disable-next-line
import MapWorker from 'worker-loader!./worker';
import PointerLock from '../controllers/pointerLock/pointerLock';
import PointerLockInterface from '../controllers/pointerLock/pointerLockInterface';
import MainModelInterface from './mainModelInterface';
import settingsConfig from '../configs/settingsConfig';
import Stats from '../controllers/pointerLock/stats.js';
import GameLoader from './gameLoader/gameLoader';
import GameLoaderInterface from './gameLoader/gameLoaderInterface';
import GameLight from './gameLight/gameLight';

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

  renderDistance: number;

  chunkSize: number;

  meshes: any;

  model: MainModelInterface;

  lastPing: number;

  ambientLight: THREE.AmbientLight;

  directionalLight: THREE.DirectionalLight;

  pointLight: THREE.PointLight;

  lastChange: number;

  worker: Worker;

  workerInterval: any;

  seed: string;

  connectedPlayers: any;

  private isLantern: boolean;

  private gameView: any;

  private isLockPosition: number;

  private gameLoader: GameLoaderInterface;

  private grassTexture: THREE.Texture;

  private sandTexture: THREE.Texture;

  private smallTree: THREE.Object3D;

  private largeTree: THREE.Object3D;

  private gameLight: any;

  lastSunUpdate: number;

  constructor(model: MainModelInterface) {
    this.model = model;
    this.createScene();
    this.gameLight = new GameLight(this);
    this.gameLight.createLight();
    this.gameLoader = new GameLoader(this);
    this.gameLoader.loadTextures();
    this.gameLoader.loadObjects();
    this.forward = false;
    this.left = false;
    this.backward = false;
    this.right = false;
    this.jump = false;
    this.meshes = {};
    this.renderDistance = 6;
    this.chunkSize = 16;
    this.connectPlayers();
    this.disconnectPlayers();
    this.connectedPlayers = {};
    this.isLantern = false;
    this.gameView = null;
    this.isLockPosition = 1; // or 0
  }

  public setTexture(texture: THREE.Texture) {
    switch (texture.name) {
      case 'grassTexture': this.grassTexture = texture; break;
      case 'sandTexture': this.sandTexture = texture; break;
      default: break;
    }
  }

  public setObject(object: THREE.Object3D) {
    switch (object.name) {
      case 'smallTree': this.smallTree = object; break;
      case 'largeTree': this.largeTree = object; break;
      default: break;
    }
  }

  public setPlayer(player: THREE.Object3D) {
    this.connectedPlayers[player.name] = player;
    this.scene.add(player);
  }

  public setGameView(gameView: any) {
    this.gameView = gameView;
  }

  public changeLanternStatus() {
    if (this.gameLight.checkNight()) {
      if (this.isLantern) {
        this.hideLantern();
      } else {
        this.takeLantern();
      }
      this.isLantern = !this.isLantern;
    }
  }

  private takeLantern() {
    this.gameLight.addLanternToScene();
    this.gameView.addLanternClass();
  }

  private hideLantern() {
    this.gameLight.removeLanternFromScene();
    this.gameView.removeLanternClass();
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
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.domElement.classList.add('renderer');
  }

  connectPlayers() {
    document.body.addEventListener('connectplayer', (event: CustomEvent) => {
      this.gameLoader.loadPlayer(event.detail.token);
    });
    document.body.addEventListener('moveplayer', (event: CustomEvent) => {
      this.smoothPlayerMotion(event.detail);
    });
  }

  disconnectPlayers() {
    document.body.addEventListener('disconnectplayer', (event: CustomEvent) => {
      this.removePlayer(event.detail.token);
    });
  }

  removePlayer(token: string) {
    this.scene.remove(this.connectedPlayers[token]);
    delete this.connectedPlayers[token];
  }

  smoothPlayerMotion(evDetail: any) {
    const mesh = this.connectedPlayers[evDetail.token];

    if (!mesh) {
      return;
    }

    const zInitialVal = mesh.position.z;
    const zPosTo = Number(evDetail.z);
    const increaseZ = zInitialVal < zPosTo ? 1 : -1;

    const xInitialVal = mesh.position.x;
    const xPosTo = Number(evDetail.x);
    const increaseX = xInitialVal < xPosTo ? 1 : -1;

    const yInitialVal = mesh.position.y;
    const yPosTo = Number(evDetail.y);
    const increaseY = yInitialVal < yPosTo ? 1 : -1;

    const cInitialVal = mesh.rotation.y;
    const cPosTo = evDetail.c * Math.PI;
    const increaseC = cInitialVal < cPosTo ? 0.05 : -0.05;

    let isXReturnFlagHoisted = false;
    let isZReturnFlagHoisted = false;
    let isYReturnFlagHoisted = false;
    let isCReturnFlagHoisted = false;

    if ((cInitialVal > 0 && cPosTo < 0) || (cInitialVal < 0 && cPosTo > 0)) {
      mesh.rotation.y = cPosTo;
      isCReturnFlagHoisted = true;
    }

    function renderPlayerMotion() {
      /* return */
      if (
        isYReturnFlagHoisted
        && isXReturnFlagHoisted
        && isZReturnFlagHoisted
        && isCReturnFlagHoisted
      ) {
        return;
      }

      /* Z */
      if (!isZReturnFlagHoisted) {
        // eslint-disable-next-line max-len
        if ((increaseZ === -1 && zPosTo >= mesh.position.z) || (increaseZ === 1 && zPosTo <= mesh.position.z)) {
          mesh.position.z = zPosTo;
          isZReturnFlagHoisted = true;
        } else {
          mesh.position.z += increaseZ;
        }
      }

      /* X */
      if (!isXReturnFlagHoisted) {
        // eslint-disable-next-line max-len
        if ((increaseX === -1 && xPosTo >= mesh.position.x) || (increaseX === 1 && xPosTo <= mesh.position.x)) {
          mesh.position.x = xPosTo;
          isXReturnFlagHoisted = true;
        } else {
          mesh.position.x += increaseX;
        }
      }

      /* Y */
      if (!isYReturnFlagHoisted) {
        // eslint-disable-next-line max-len
        if ((increaseY === -1 && yPosTo >= mesh.position.y) || (increaseY === 1 && yPosTo <= mesh.position.y)) {
          mesh.position.y = yPosTo;
          isYReturnFlagHoisted = true;
        } else {
          mesh.position.y += increaseY;
        }
      }

      /* Cam rotation */
      if (!isCReturnFlagHoisted) {
        // eslint-disable-next-line max-len
        if ((increaseC === -0.05 && cPosTo >= mesh.rotation.y) || (increaseC === 0.05 && cPosTo <= mesh.rotation.y)) {
          mesh.rotation.y = cPosTo;
          isCReturnFlagHoisted = true;
        } else {
          mesh.rotation.y += increaseC;
        }
      }
      requestAnimationFrame(renderPlayerMotion);
    }
    renderPlayerMotion();
  }

  generateWorld(seed: string) {
    setTimeout(() => {
      this.isLockPosition = 1;
    }, 10000);
    this.seed = seed;
    this.stats = Stats();
    this.stats.showPanel(0);

    this.raycaster = new THREE.Raycaster(
      new THREE.Vector3(),
      new THREE.Vector3(0, -1, 0), 0, 20,
    );

    this.time = performance.now();
    this.speed = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    this.camera.position.y = 200; // 700
    this.camera.position.x = (this.chunkSize / 2) * 10;
    this.camera.position.z = (this.chunkSize / 2) * 10;

    this.currentChunk = {
      x: 0,
      z: 0,
    };

    this.worker = new MapWorker();

    const material = new THREE.MeshLambertMaterial(
      { map: this.grassTexture, side: THREE.FrontSide },
    );
    const sandMaterial = new THREE.MeshLambertMaterial(
      { map: this.sandTexture, side: THREE.FrontSide },
    );
    const waterMaterial = new THREE.MeshLambertMaterial();
    waterMaterial.color = new THREE.Color(0x4980A2);

    waterMaterial.transparent = true;
    waterMaterial.opacity = 0.5;

    this.worker.onmessage = (event: any) => {
      setTimeout(() => {
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
          mesh.castShadow = true;
          mesh.position.setX(xChunk * this.chunkSize * 10);
          mesh.position.setZ(zChunk * this.chunkSize * 10);

          const sandMesh = new THREE.Mesh(sandBufferGeometry, sandMaterial);
          sandMesh.receiveShadow = true;
          sandMesh.castShadow = true;
          sandMesh.position.setX(xChunk * this.chunkSize * 10);
          sandMesh.position.setZ(zChunk * this.chunkSize * 10);

          const water = new THREE.Mesh(waterBufferGeometry, waterMaterial);
          water.receiveShadow = true;
          water.castShadow = true;
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
          const treeClone = event.data.small
            ? this.smallTree.clone(true)
            : this.largeTree.clone(true);
          treeClone.rotation.y = Math.PI / Math.random();
          treeClone.position.x = event.data.x;
          treeClone.position.y = event.data.y;
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

    this.worker.postMessage({ seed: this.seed });
    this.worker.postMessage({ xChunk: 0, zChunk: 0, load: true });
  }

  animationFrame() {
    this.stats.begin();
    this.jump = false;
    const time = performance.now();

    // how often should send to the server
    const period = 1000; // in ms
    // send player coordinates to the server
    const pingTime = Math.trunc(time / period);
    if (this.model.isHandshaked() && this.lastPing !== pingTime) {
      this.lastPing = pingTime;
      this.model.sendHeroCoordinates(
        String(Math.trunc(this.camera.position.x)),
        String(Math.trunc(this.camera.position.z)),
        String(Math.trunc(this.camera.position.y)),
        String(this.camera.quaternion.y),
      );
    }

    // const sunUpdateTime = Math.trunc(time / 1000);
    // if (this.lastSunUpdate !== sunUpdateTime) {
    //   this.lastSunUpdate = sunUpdateTime;
    this.gameLight.setSunlightAngle(time);
    this.gameLight.setSunligntPosition(this.camera.position);
    // }

    // check time to update light
    // const dayLength = 500000; // in ms
    // const dayTime = Math.trunc(time / dayLength);
    // if (dayTime && dayTime !== this.lastChange) {
    //   this.lastChange = dayTime;
    //   this.gameLight.changeLight();
    // }

    // check position to update map
    let newChunkX = this.camera.position.x / 10 / this.chunkSize;
    let newChunkZ = this.camera.position.z / 10 / this.chunkSize;
    if (newChunkX < 0) newChunkX -= 1;
    if (newChunkZ < 0) newChunkZ -= 1;
    newChunkX = Math.trunc(newChunkX);
    newChunkZ = Math.trunc(newChunkZ);
    if (newChunkX !== this.currentChunk.x || newChunkZ !== this.currentChunk.z) {
      // this.gameLight.setSunligntChunk(this.camera.position);
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
      this.speed.x -= this.speed.x * 10.0 * delta * this.isLockPosition;
      this.speed.z -= this.speed.z * 10.0 * delta * this.isLockPosition;
      this.speed.y -= 9.8 * 50.0 * delta * this.isLockPosition;
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
          this.speed.y = 0;
          this.raycaster.far = 5;
          this.control.SPEED = 0.75;
          up = 2.5;
        } else {
          this.raycaster.far = 20;
          this.control.SPEED = 1.5;
          up = 15;
        }
        this.speed.y = Math.max(0, this.speed.y);
        if (this.speed.y <= 0) {
          this.jump = true;
        }
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
      this.gameLight.lightFollowCamera(this.camera.position);
    }
    this.time = time;
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
    requestAnimationFrame(this.animationFrame.bind(this));
  }
}

export default GameModel;
