import * as THREE from 'three';
import * as SimplexNoise from 'simplex-noise';
import Stats from '../controllers/modules/stats.js';
import { PointerLockControls } from '../controllers/modules/pointerLockControls.js';

class GameView {
  stats: any;

  data: Array<number>;

  currentChunk: {
    x: number,
    z: number,
  }

  xNextChunk: number;

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

  perlin: SimplexNoise;

  renderDistance: number;

  chunkSize: number;

  meshes: Array<Array<THREE.Mesh>>;

  constructor() {
    this.forward = false;
    this.left = false;
    this.backward = false;
    this.right = false;
    this.jump = false;
    this.perlin = new SimplexNoise();
    this.meshes = [];
    this.renderDistance = 5;
    this.chunkSize = 25;
  }

  createScene() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xffffff, 0.001);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.classList.add('renderer');

    this.scene.background = new THREE.Color(0x87CEEB);
  }

  generateHeight(length: number, xChunk: number, zChunk: number) {
    const xFrom = xChunk * length;
    const zFrom = zChunk * length;
    const data: Array<number> = [];
    const accuracy = 60;
    const unflatness = 30;
    let index = 0;
    for (let x = xFrom; x < xFrom + length; x += 1) {
      for (let z = zFrom; z < zFrom + length; z += 1) {
        data[index] = this.perlin.noise2D(x / accuracy, z / accuracy) * unflatness;
        index += 1;
      }
    }
    this.data = data;
  }

  generateWorld() {
    this.stats = Stats();
    this.stats.showPanel(0);

    this.raycaster = new THREE.Raycaster(
      new THREE.Vector3(),
      new THREE.Vector3(0, -1, 0), 0, 10,
    );

    this.time = performance.now();
    this.speed = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    this.collision = [];

    this.camera.position.y = 200;
    this.camera.position.x = (this.chunkSize / 2) * 10;
    this.camera.position.z = (this.chunkSize / 2) * 10;

    this.currentChunk = {
      x: 0,
      z: 0,
    };

    this.generateChunks();

    const ambientLight = new THREE.AmbientLight(0xcccccc);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 0.5).normalize();
    this.scene.add(directionalLight);

    // const loader = new THREE.TextureLoader().setPath('./assets/textures/blocks/');
    // const materialArray = [
    //   new THREE.MeshBasicMaterial({ map: loader.load('grass_side.png') }),
    //   new THREE.MeshBasicMaterial({ map: loader.load('grass_side.png') }),
    //   new THREE.MeshBasicMaterial({ map: loader.load('grass_top.png') }),
    //   new THREE.MeshBasicMaterial({ map: loader.load('dirt.png') }),
    //   new THREE.MeshBasicMaterial({ map: loader.load('grass_side.png') }),
    //   new THREE.MeshBasicMaterial({ map: loader.load('grass_side.png') }),
    // ];

    // const chunkSize = 10;
    // const renderDistance = 500;
    // const geometry = new THREE.BoxGeometry(chunkSize, chunkSize, chunkSize);
    // const simplex = new SimplexNoise();
    // const instanceChunk = new THREE.InstancedMesh(geometry, materialArray,
    //   chunkSize * chunkSize * renderDistance);

    // let count = 0;

    // for (let x = -renderDistance; x < renderDistance; x += chunkSize) {
    //   for (let z = -renderDistance; z < renderDistance; z += chunkSize) {
    //     const y = 200 + Math.round(Math.round(simplex.noise2D(x / 500, z / 500) * 200)
    //       / chunkSize) * chunkSize;

    //     const matrix = new THREE.Matrix4().makeTranslation(x, y, z);

    //     instanceChunk.setMatrixAt(count, matrix);
    //     count += 1;
    //   }
    // }

    // this.scene.add(instanceChunk);

    // this.collision.push(instanceChunk);
  }

  generateChunks() {
    for (let i = -this.renderDistance; i <= this.renderDistance; i += 1) {
      const line: Array<THREE.Mesh> = [];
      for (let j = -this.renderDistance; j <= this.renderDistance; j += 1) {
        line.push(this.loadChunk(i, j));
      }
      this.meshes.push(line);
    }
  }

  updateChunks(newX: number, newZ: number) {
    // moving left
    if ((newX - this.currentChunk.x) < 0 && !(newZ - this.currentChunk.z)) {
      // removing old chunks
      this.meshes[this.meshes.length - 1].forEach((mesh) => {
        setTimeout(() => {
          this.scene.remove(mesh);
          mesh.geometry.dispose();
        }, 0);
      });
      this.meshes.pop();

      // add new chunks to map and to this.meshes array
      const leftLineOfChunks: Array<THREE.Mesh> = [];
      for (let z = -this.renderDistance + newZ; z <= this.renderDistance + newZ; z += 1) {
        setTimeout(() => {
          leftLineOfChunks.push(this.loadChunk(newX - this.renderDistance, z));
        }, 0);
      }
      this.meshes.unshift(leftLineOfChunks);
    }

    // moving right
    if ((newX - this.currentChunk.x) > 0 && !(newZ - this.currentChunk.z)) {
      // removing old chunks
      this.meshes[0].forEach((mesh) => {
        setTimeout(() => {
          this.scene.remove(mesh);
          mesh.geometry.dispose();
        }, 0);
      });
      this.meshes.shift();

      // add new chunks to map and to this.meshes array
      const rightLineOfChunks: Array<THREE.Mesh> = [];
      for (let z = -this.renderDistance + newZ; z <= this.renderDistance + newZ; z += 1) {
        setTimeout(() => {
          rightLineOfChunks.push(this.loadChunk(newX + this.renderDistance, z));
        }, 0);
      }
      this.meshes.push(rightLineOfChunks);
    }

    // moving up
    if (!(newX - this.currentChunk.x) && (newZ - this.currentChunk.z) < 0) {
      // removing old chunks
      this.meshes.forEach((line) => {
        setTimeout(() => {
          this.scene.remove(line[line.length - 1]);
          line[line.length - 1].geometry.dispose();
          line.pop();
        }, 0);
      });

      // add new chunks to map and to this.meshes array
      let index = 0;
      for (let x = -this.renderDistance + newX; x <= this.renderDistance + newX; x += 1) {
        setTimeout(() => {
          const chunk = this.loadChunk(x, newZ - this.renderDistance);
          this.meshes[index].unshift(chunk);
          index += 1;
        }, 0);
      }
    }

    // moving down
    if (!(newX - this.currentChunk.x) && (newZ - this.currentChunk.z) > 0) {
      // removing old chunks
      this.meshes.forEach((line) => {
        setTimeout(() => {
          this.scene.remove(line[0]);
          line[0].geometry.dispose();
          line.shift();
        }, 0);
      });

      // add new chunks to map and to this.meshes array
      let index = 0;
      for (let x = -this.renderDistance + newX; x <= this.renderDistance + newX; x += 1) {
        setTimeout(() => {
          const chunk = this.loadChunk(x, newZ + this.renderDistance);
          this.meshes[index].push(chunk);
          index += 1;
        }, 0);
      }
    }
  }

  getY(x: number, z:number) {
    return Math.trunc(this.data[x * this.chunkSize + z] / 5) || 0;
  }

  loadChunk(xChunk: number, zChunk: number) {
    this.generateHeight(this.chunkSize, xChunk, zChunk);

    const matrix = new THREE.Matrix4();

    const x1Geometry = new THREE.PlaneGeometry(10, 10);
    x1Geometry.faceVertexUvs[0][0][0].y = 0.5;
    x1Geometry.faceVertexUvs[0][0][2].y = 0.5;
    x1Geometry.faceVertexUvs[0][1][2].y = 0.5;
    x1Geometry.rotateY(Math.PI / 2);
    x1Geometry.translate(5, 0, 0);

    const x2Geometry = new THREE.PlaneGeometry(10, 10);
    x2Geometry.faceVertexUvs[0][0][0].y = 0.5;
    x2Geometry.faceVertexUvs[0][0][2].y = 0.5;
    x2Geometry.faceVertexUvs[0][1][2].y = 0.5;
    x2Geometry.rotateY(-Math.PI / 2);
    x2Geometry.translate(-5, 0, 0);

    const y1Geometry = new THREE.PlaneGeometry(10, 10);
    y1Geometry.faceVertexUvs[0][0][1].y = 0.5;
    y1Geometry.faceVertexUvs[0][1][0].y = 0.5;
    y1Geometry.faceVertexUvs[0][1][1].y = 0.5;
    y1Geometry.rotateX(-Math.PI / 2);
    y1Geometry.translate(0, 5, 0);

    // const y2Geometry = new THREE.PlaneGeometry(10, 10);
    // y2Geometry.faceVertexUvs[0][0][1].y = 0.5;
    // y2Geometry.faceVertexUvs[0][1][0].y = 0.5;
    // y2Geometry.faceVertexUvs[0][1][1].y = 0.5;
    // y2Geometry.rotateX(-Math.PI / 2);
    // y2Geometry.rotateY(Math.PI / 2);
    // y2Geometry.translate(0, 5, 0);

    const z1Geometry = new THREE.PlaneGeometry(10, 10);
    z1Geometry.faceVertexUvs[0][0][0].y = 0.5;
    z1Geometry.faceVertexUvs[0][0][2].y = 0.5;
    z1Geometry.faceVertexUvs[0][1][2].y = 0.5;
    z1Geometry.translate(0, 0, 5);

    const z2Geometry = new THREE.PlaneGeometry(10, 10);
    z2Geometry.faceVertexUvs[0][0][0].y = 0.5;
    z2Geometry.faceVertexUvs[0][0][2].y = 0.5;
    z2Geometry.faceVertexUvs[0][1][2].y = 0.5;
    // z2Geometry.rotateY(Math.PI);
    z2Geometry.translate(0, 0, -5);

    const geometry = new THREE.Geometry();

    for (let x = 0; x < this.chunkSize; x += 1) {
      for (let z = 0; z < this.chunkSize; z += 1) {
        const y = Math.trunc(this.data[x * this.chunkSize + z] / 5) || 0;

        matrix.makeTranslation(
          x * 10,
          y * 10,
          z * 10,
        );

        geometry.merge(y1Geometry, matrix);

        if ((this.getY(x + 1, z) !== y && this.getY(x + 1, z) !== y + 1)
        || x === this.chunkSize - 1) {
          geometry.merge(x1Geometry, matrix);
        }
        if ((this.getY(x - 1, z) !== y && this.getY(x - 1, z) !== y + 1) || x === 0) {
          geometry.merge(x2Geometry, matrix);
        }
        if ((this.getY(x, z + 1) !== y && this.getY(x, z + 1) !== y + 1)
        || z === this.chunkSize - 1) {
          geometry.merge(z1Geometry, matrix);
        }
        if ((this.getY(x, z - 1) !== y && this.getY(x, z - 1) !== y + 1) || z === 0) {
          geometry.merge(z2Geometry, matrix);
        }
      }
    }

    const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);

    const texture = new THREE.TextureLoader().load('../assets/textures/atlas.png');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;

    const mesh = new THREE.Mesh(
      bufferGeometry,
      new THREE.MeshLambertMaterial({ map: texture, vertexColors: true, side: THREE.DoubleSide }),
    );
    this.scene.add(mesh);

    mesh.position.setX(xChunk * this.chunkSize * 10);
    mesh.position.setZ(zChunk * this.chunkSize * 10);
    this.collision.push(mesh);

    return mesh;
  }

  animationFrame() {
    this.stats.begin();
    this.jump = false;
    const time = performance.now();
    let newChunkX = this.camera.position.x / 10 / this.chunkSize;
    let newChunkZ = this.camera.position.z / 10 / this.chunkSize;
    if (newChunkX < 0) newChunkX -= 1;
    if (newChunkZ < 0) newChunkZ -= 1;
    newChunkX = Math.trunc(newChunkX);
    newChunkZ = Math.trunc(newChunkZ);
    if (newChunkX !== this.currentChunk.x || newChunkZ !== this.currentChunk.z) {
      this.updateChunks(newChunkX, newChunkZ);
      this.currentChunk.x = newChunkX;
      this.currentChunk.z = newChunkZ;
      console.log(this.currentChunk);
    }
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
        this.speed.y += 20;
      }

      // if player fall down under textures
      if (this.camera.position.y < -300) {
        this.camera.position.y = 300;
        this.speed.y = 0;
      }

      this.control.moveRight(-this.speed.x * delta);
      this.control.moveForward(-this.speed.z * delta);
      this.camera.position.y += (this.speed.y * delta);
    }
    this.time = time;
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
    requestAnimationFrame(this.animationFrame.bind(this));
  }
}

export default GameView;
