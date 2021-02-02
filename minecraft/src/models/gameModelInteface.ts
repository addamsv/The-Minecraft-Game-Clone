/* eslint-disable no-unused-vars */

import * as THREE from 'three';
import SoundModelInterface from './soundModel/soundModelInterface';
import PointerLockInterface from '../controllers/pointerLock/pointerLockInterface';
import MainModelInterface from './mainModelInterface';

interface GameModelInterace {

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

  isLockPosition: number;

  gameLight: any;

  sound: SoundModelInterface;

  isMovingSoundNowPlaying: boolean;

  jumpSound: boolean;

  isBackgroundNowPlaying: boolean;

  isShiftPressed: Boolean;

  destroyWorld(): void;

  setTexture(texture: THREE.Texture): void;

  setObject(object: THREE.Object3D): void;

  loadPlayer(token: string): void;

  setPlayer(player: THREE.Object3D): void;

  setAnimation(animation: any): void;

  removePlayer(token: string): void;

  setView(views: any): void;

  changeSwordStatus(): void;

  hitSword(): void;

  changeLanternStatus(): void;

  createScene(): void;

  generateWorld(seed: string): void;

  animationFrame(): void;

  // stats: any;
  // currentChunk: {
  //   x: number,
  //   z: number,
  // }
  // camera: THREE.PerspectiveCamera;
  // scene: THREE.Scene;
  // renderer: THREE.WebGLRenderer;
  // raycaster: THREE.Raycaster;
  // time: number;
  // speed: THREE.Vector3;
  // direction: THREE.Vector3;
  // forward: boolean;
  // left: boolean;
  // backward: boolean;
  // right: boolean;
  // jump: boolean;
  // control: PointerLockInterface;
  // renderDistance: number;
  // chunkSize: number;
  // meshes: any;
  // model: MainModelInterface;
  // lastPing: number;
  // ambientLight: THREE.AmbientLight;
  // directionalLight: THREE.DirectionalLight;
  // pointLight: THREE.PointLight;
  // night: boolean;
  // lastChange: number;
  // worker: Worker;
  // workerInterval: any;
  // seed: string;
  // connectedPlayers: any;
}

export default GameModelInterace;
