/* eslint-disable import/no-webpack-loader-syntax, import/no-unresolved */

import * as THREE from 'three';
import MapWorker from 'worker-loader!./worker';
import PointerLock from '../controllers/pointerLock/pointerLock';
import PointerLockInterface from '../controllers/pointerLock/pointerLockInterface';
import MainModelInterface from './mainModelInterface';
import settingsConfig from '../configs/settingsConfig';
import GameLoader from './gameLoader/gameLoader';
import GameLoaderInterface from './gameLoader/gameLoaderInterface';
import GameLight from './gameLight/gameLight';
import PlayerMotion from './playerMotion/playerMotion';
import SoundModel from './soundModel/soundModel';

const COOLDOWN_TIME = 2000;

class GameModel {
  currentChunk: {
    x: number,
    z: number,
  }

  camera: THREE.PerspectiveCamera;

  private cameraHeight: number;

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

  private gameView: any;

  private statsView: any;

  private isLanternCooldown: boolean;

  private isSword: boolean;

  private isSwordCooldown: boolean;

  private isHitCooldown: boolean;

  public isLockPosition: number;

  private gameLoader: GameLoaderInterface;

  private grassTexture: THREE.Texture;

  private sandTexture: THREE.Texture;

  private smallTree: THREE.Object3D;

  private largeTree: THREE.Object3D;

  public gameLight: any;

  sound: SoundModel;

  isMovingSoundNowPlaying: boolean;

  jumpSound: boolean;

  isBackgroundNowPlaying: boolean;

  private intersectObjects: boolean;

  private startTime: number;

  private playerMotion: any;

  private sword: THREE.Object3D;

  private swordAnime: any;

  private mixer: THREE.AnimationMixer;

  private clock: THREE.Clock;

  isShiftPressed: Boolean;

  isRunning: Boolean;

  constructor(model: MainModelInterface) {
    this.startTime = performance.now();
    this.model = model;
    this.createScene();
    this.cameraHeight = 15;
    this.gameLight = new GameLight(this);
    this.gameLight.createLight();
    this.gameLoader = new GameLoader(this);
    this.gameLoader.loadTextures();
    this.gameLoader.loadObjects();
    this.playerMotion = new PlayerMotion(this);
    this.forward = false;
    this.left = false;
    this.backward = false;
    this.right = false;
    this.jump = false;
    this.intersectObjects = false;
    this.meshes = {};
    this.chunkSize = 16;
    this.gameView = null;
    this.statsView = null;
    this.isLanternCooldown = false;
    this.isSword = false;
    this.isSwordCooldown = false;
    this.isHitCooldown = false;
    this.isRunning = false;
    this.isLockPosition = 0; // or 1
    this.isMovingSoundNowPlaying = false;
    this.isBackgroundNowPlaying = false;
    this.sound = new SoundModel();
    this.model.setPlayerMotion(this.playerMotion);
  }

  public destroyWorld() {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
    this.renderer.domElement.remove();
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
      case 'sword': {
        this.sword = object;
        this.mixer = new THREE.AnimationMixer(this.sword);
        break;
      }
      default: break;
    }
  }

  public loadPlayer(token: string) {
    this.gameLoader.loadPlayer(token);
  }

  public setPlayer(player: THREE.Object3D) {
    this.playerMotion.connectedPlayers[player.name] = player;
    this.scene.add(player);
  }

  public setAnimation(animation: any) {
    this.swordAnime = animation;
  }

  public removePlayer(token: string) {
    this.scene.remove(this.playerMotion.connectedPlayers[token]);
    delete this.playerMotion.connectedPlayers[token];
  }

  public setView(views: any) {
    this.gameView = views.gameView;
    this.statsView = views.statsView;
  }

  public changeSwordStatus() {
    if (!this.isSwordCooldown) {
      if (this.isSword) {
        this.hideSword();
      } else {
        this.takeSword();
      }
    }
  }

  public hitSword() {
    if (this.isSword && !this.isHitCooldown) {
      this.isHitCooldown = true;
      this.startSwordCooldown();
      const hit = this.mixer.clipAction(this.swordAnime);
      hit.play();
      setTimeout(() => {
        hit.stop();
      }, 625);
      setTimeout(() => {
        this.isHitCooldown = false;
      }, COOLDOWN_TIME);
    }
  }

  private takeSword() {
    this.isSword = true;
    this.scene.add(this.sword);
    this.gameView.addSwordClass();
    this.startSwordCooldown();
  }

  private hideSword() {
    this.isSword = false;
    this.scene.remove(this.sword);
    this.gameView.removeSwordClass();
    this.startSwordCooldown();
  }

  private startSwordCooldown() {
    this.isSwordCooldown = true;
    this.gameView.showSwordCooldown();
    setTimeout(() => {
      this.isSwordCooldown = false;
    }, COOLDOWN_TIME);
  }

  public changeLanternStatus() {
    if (this.gameLight.isNight && !this.isLanternCooldown) {
      if (this.gameLight.isLantern) {
        this.hideLantern();
      } else {
        this.takeLantern();
      }
    }
  }

  private takeLantern() {
    this.gameLight.isLantern = true;
    this.gameLight.addLanternToScene();
    this.gameView.addLanternClass();
    this.startLanternCooldown();
  }

  private hideLantern() {
    this.gameLight.isLantern = false;
    this.gameLight.removeLanternFromScene();
    this.gameView.removeLanternClass();
    this.startLanternCooldown();
  }

  private startLanternCooldown() {
    this.isLanternCooldown = true;
    this.gameView.showLanternCooldown();
    setTimeout(() => {
      this.isLanternCooldown = false;
    }, COOLDOWN_TIME);
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

    this.renderer = new THREE.WebGLRenderer(); // { powerPreference: 'high-performance' }
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.domElement.classList.add('renderer');
  }

  generateWorld(seed: string) {
    this.seed = seed;

    this.raycaster = new THREE.Raycaster(
      new THREE.Vector3(),
      new THREE.Vector3(0, -1, 0), 0, 20,
    );

    this.time = performance.now();
    this.speed = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    this.camera.position.y = 600;
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
        if (event.data.unlockPosition) {
          this.isLockPosition = 1;
          this.startTime = performance.now();
          setTimeout(() => {
            this.intersectObjects = true;
          }, COOLDOWN_TIME);
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

          const grassMesh = new THREE.Mesh(bufferGeometry, material);
          grassMesh.receiveShadow = true;
          grassMesh.castShadow = true;
          grassMesh.position.setX(xChunk * this.chunkSize * 10);
          grassMesh.position.setZ(zChunk * this.chunkSize * 10);
          grassMesh.name = 'grass';

          const sandMesh = new THREE.Mesh(sandBufferGeometry, sandMaterial);
          sandMesh.receiveShadow = true;
          sandMesh.castShadow = true;
          sandMesh.position.setX(xChunk * this.chunkSize * 10);
          sandMesh.position.setZ(zChunk * this.chunkSize * 10);
          sandMesh.name = 'sand';

          const water = new THREE.Mesh(waterBufferGeometry, waterMaterial);
          water.receiveShadow = true;
          water.castShadow = true;
          water.position.setX(xChunk * this.chunkSize * 10);
          water.position.setZ(zChunk * this.chunkSize * 10);
          water.name = 'water';

          meshMemo.obj = grassMesh;
          meshMemo.hasObj = true;
          meshMemo.sand = sandMesh;
          meshMemo.water = water;
          if (!meshMemo.markForRemoval) {
            this.scene.add(grassMesh);
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
    this.gameLight.startDay();
    this.clock = new THREE.Clock();
  }

  animationFrame() {
    this.jump = false;
    const time = performance.now(); // - this.startTime;
    this.mixer.update(this.clock.getDelta());

    // how often should send to the server
    const period = 1000; // in ms
    // send player coordinates to the server
    const pingTime = Math.trunc(time / period);
    if (this.lastPing !== pingTime) {
      this.statsView.setFps(Math.round(1000 / (time - this.time)));
      this.statsView.setPosition(
        Math.round(this.camera.position.x / 10),
        Math.round(this.camera.position.z / 10),
      );
      this.statsView.setTime(pingTime);
      if (this.model.isHandshaked()) {
        this.lastPing = pingTime;
        this.model.sendHeroCoordinates(
          String(Math.trunc(this.camera.position.x)),
          String(Math.trunc(this.camera.position.z)),
          String(Math.trunc(this.camera.position.y)),
          String(this.camera.quaternion.y),
        );
      }
    }

    this.gameLight.setSunlightAngle(time);
    this.gameLight.setSunligntPosition(this.camera.position);

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
      const delta = ((time - this.time) / 1000) * this.isLockPosition;
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

      /* RAYCASTING */
      this.raycaster.ray.origin.copy(this.camera.position);
      const falling = this.raycaster.intersectObjects(this.scene.children, this.intersectObjects);
      if (falling.length) {
        /* MOVING PHYSICS & SPEED */
        const surface = falling[0].object.name;
        if (surface === 'water') {
          this.speed.y = 0;
          this.raycaster.far = 5;
          this.control.SPEED = 0.75;
          this.cameraHeight = 2.5;
        } else {
          this.raycaster.far = 20;
          this.control.SPEED = 1.5;
          this.cameraHeight = 15;
        }
        this.speed.y = Math.max(0, this.speed.y);
        if (this.speed.y <= 0) {
          this.jump = true;
        }
        if (falling[0].distance < this.cameraHeight) {
          this.speed.z = 0;
          this.speed.x = 0;
          this.speed.y += 20;
        }

        /* MOVING SOUNDS */
        const isWASD = this.direction.z || this.direction.x;
        if (this.sound.surface !== surface && this.isMovingSoundNowPlaying) {
          this.isMovingSoundNowPlaying = false;
          this.sound.stopWalkSound();
        }
        this.sound.surface = surface;
        if (isWASD && !this.isMovingSoundNowPlaying) {
          this.isMovingSoundNowPlaying = true;
          this.sound.startWalkSound();
        }
        if (!isWASD && this.isMovingSoundNowPlaying) {
          this.isMovingSoundNowPlaying = false;
          this.sound.stopWalkSound();
        }
        if (this.jumpSound && surface !== 'water') {
          if (this.isMovingSoundNowPlaying) {
            this.isMovingSoundNowPlaying = false;
            this.sound.stopWalkSound();
          }
          this.jumpSound = false;
          this.sound.jump();
        }
      }

      /* BACKGROUND MUSIC */
      if (!this.isBackgroundNowPlaying && this.sound.backgroundBuffer) {
        this.sound.backgroundStart();
        this.isBackgroundNowPlaying = true;
      }

      /* DONT FALL UNDER WORLD */
      if (this.camera.position.y < -300) {
        this.camera.position.y = 300;
        this.speed.y = 0;
      }

      // running
      if (this.isShiftPressed && (!this.isRunning || falling.length)) {
        this.control.SPEED *= 2;
        this.isRunning = true;
      } else if (!this.isShiftPressed && this.isRunning) {
        this.control.SPEED /= 2;
        this.isRunning = false;
      }

      this.control.moveRight(-this.speed.x * delta);
      this.control.moveForward(-this.speed.z * delta);
      this.camera.position.y += (this.speed.y * delta);

      if (this.sword) {
        const targetQuaternion = this.camera.quaternion;
        if (!this.sword.quaternion.equals(targetQuaternion)) {
          const step = 2 * delta;
          this.sword.quaternion.rotateTowards(targetQuaternion, step);
        }
        this.sword.position.lerp(this.camera.position, 1);
        this.sword.translateX(10);
        this.sword.translateZ(-15);
      }
    }

    this.time = time;
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animationFrame.bind(this));
  }
}

export default GameModel;
