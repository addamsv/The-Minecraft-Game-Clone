/* eslint-disable no-unused-vars */

interface GameModelInterace {
  createScene(): void;

  connectPlayers(): void;

  createNewPlayer(token: string): void;

  generateWorld(seed: string): void;

  changeLight(): void;

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
