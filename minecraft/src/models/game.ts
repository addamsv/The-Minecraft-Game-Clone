import * as THREE from 'three';
import * as SimplexNoise from 'simplex-noise';

class Game {
  camera: THREE.PerspectiveCamera;

  scene: THREE.Scene;

  renderer: THREE.WebGLRenderer;

  raycaster: THREE.Raycaster;

  time: number;

  speed: THREE.Vector3;

  direction: THREE.Vector3;

  collision: Array<THREE.Mesh>;

  createScene() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.y = 300;

    this.scene = new THREE.Scene();
    // this.scene.fog = new THREE.Fog(0x000000, 0, 750);
    // const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    // light.position.set(0.5, 1, 0.75);
    // this.scene.add(light);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.classList.add('renderer');
    document.body.appendChild(this.renderer.domElement);

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
}

export default Game;
