import * as THREE from 'three';
import * as Noise from 'simplex-noise';

// eslint-disable-next-line
const thread: Worker = self as any;

const BLOCK_SIZE = 10;
const CHUNK_SIZE = 16;
const RENDER_DISTANCE = 6;
const DEFAULT_INTERVAL = 50;

const x1Geometry = new THREE.PlaneGeometry(BLOCK_SIZE, BLOCK_SIZE);
x1Geometry.faceVertexUvs[0][0][0].y = 0.5;
x1Geometry.faceVertexUvs[0][0][2].y = 0.5;
x1Geometry.faceVertexUvs[0][1][2].y = 0.5;
x1Geometry.rotateY(Math.PI / 2);
x1Geometry.translate(5, 0, 0);

const x2Geometry = new THREE.PlaneGeometry(BLOCK_SIZE, BLOCK_SIZE);
x2Geometry.faceVertexUvs[0][0][0].y = 0.5;
x2Geometry.faceVertexUvs[0][0][2].y = 0.5;
x2Geometry.faceVertexUvs[0][1][2].y = 0.5;
x2Geometry.rotateY(-Math.PI / 2);
x2Geometry.translate(-5, 0, 0);

const y1Geometry = new THREE.PlaneGeometry(BLOCK_SIZE, BLOCK_SIZE);
y1Geometry.faceVertexUvs[0][0][1].y = 0.5;
y1Geometry.faceVertexUvs[0][1][0].y = 0.5;
y1Geometry.faceVertexUvs[0][1][1].y = 0.5;
y1Geometry.rotateX(-Math.PI / 2);
y1Geometry.translate(0, 5, 0);

// const y2Geometry = new THREE.PlaneGeometry(BLOCK_SIZE, BLOCK_SIZE);
// y2Geometry.faceVertexUvs[0][0][1].y = 0.5;
// y2Geometry.faceVertexUvs[0][1][0].y = 0.5;
// y2Geometry.faceVertexUvs[0][1][1].y = 0.5;
// y2Geometry.rotateX(-Math.PI / 2);
// y2Geometry.rotateY(Math.PI / 2);
// y2Geometry.translate(0, 5, 0);

const z1Geometry = new THREE.PlaneGeometry(BLOCK_SIZE, BLOCK_SIZE);
z1Geometry.faceVertexUvs[0][0][0].y = 0.5;
z1Geometry.faceVertexUvs[0][0][2].y = 0.5;
z1Geometry.faceVertexUvs[0][1][2].y = 0.5;
z1Geometry.translate(0, 0, 5);

const z2Geometry = new THREE.PlaneGeometry(BLOCK_SIZE, BLOCK_SIZE);
z2Geometry.faceVertexUvs[0][0][0].y = 0.5;
z2Geometry.faceVertexUvs[0][0][2].y = 0.5;
z2Geometry.faceVertexUvs[0][1][2].y = 0.5;
// z2Geometry.rotateY(Math.PI);
z2Geometry.translate(0, 0, -5);

class CreateChunk {
  data: Array<number>;

  seed: string;

  perlin: Noise;

  constructor() {
    this.data = [];
    this.seed = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    this.perlin = new Noise(this.seed);
  }

  generateHeight(xChunk: number, zChunk: number) {
    const xFrom = xChunk * CHUNK_SIZE;
    const zFrom = zChunk * CHUNK_SIZE;
    const accuracy = 60;
    const unflatness = 30;
    let index = 0;
    for (let x = xFrom; x < xFrom + CHUNK_SIZE; x += 1) {
      for (let z = zFrom; z < zFrom + CHUNK_SIZE; z += 1) {
        this.data[index] = this.perlin.noise2D(x / accuracy, z / accuracy) * unflatness;
        index += 1;
      }
    }
  }

  getY(x: number, z:number) {
    return Math.trunc(this.data[x * CHUNK_SIZE + z] / 5) || 0;
  }

  load(xChunk: number, zChunk: number) {
    this.generateHeight(xChunk, zChunk);

    const matrix = new THREE.Matrix4();
    const geometry = new THREE.Geometry();
    const queue: Array<object> = [];

    for (let x = 0; x < CHUNK_SIZE; x += 1) {
      for (let z = 0; z < CHUNK_SIZE; z += 1) {
        const y = this.getY(x, z);
        if (y === 0 && (
          Math.random() < 0.01
          // this.data[x * CHUNK_SIZE + z].toFixed(2) === '0.05'
          // || this.data[x * CHUNK_SIZE + z].toFixed(2) === '0.11'
          // || this.data[x * CHUNK_SIZE + z].toFixed(2) === '0.15'
          // || this.data[x * CHUNK_SIZE + z].toFixed(2) === '0.21'
          // || this.data[x * CHUNK_SIZE + z].toFixed(2) === '0.25'
          // || this.data[x * CHUNK_SIZE + z].toFixed(2) === '0.31'
          // || this.data[x * CHUNK_SIZE + z].toFixed(2) === '0.35'
        )) {
          queue.push({
            x, z, xChunk, zChunk,
          });
        }

        matrix.makeTranslation(
          x * BLOCK_SIZE,
          y * BLOCK_SIZE,
          z * BLOCK_SIZE,
        );

        geometry.merge(y1Geometry, matrix);

        if ((this.getY(x + 1, z) !== y && this.getY(x + 1, z) !== y + 1) || x === CHUNK_SIZE - 1) {
          geometry.merge(x1Geometry, matrix);
        }
        if ((this.getY(x - 1, z) !== y && this.getY(x - 1, z) !== y + 1) || x === 0) {
          geometry.merge(x2Geometry, matrix);
        }
        if ((this.getY(x, z + 1) !== y && this.getY(x, z + 1) !== y + 1) || z === CHUNK_SIZE - 1) {
          geometry.merge(z1Geometry, matrix);
        }
        if ((this.getY(x, z - 1) !== y && this.getY(x, z - 1) !== y + 1) || z === 0) {
          geometry.merge(z2Geometry, matrix);
        }
      }
    }
    queue.forEach((item: any, index: number) => {
      thread.postMessage({
        x: item.x * BLOCK_SIZE,
        z: item.z * BLOCK_SIZE,
        xChunk: item.xChunk,
        zChunk: item.zChunk,
        tree: true,
        last: !queue[index + 1],
      });
    });

    return geometry;
  }
}

const createChunk = new CreateChunk();
let workerInterval: any;

thread.addEventListener('message', (event: any) => {
  if (event.data.load) {
    const { xChunk, zChunk } = event.data;

    let geometry = createChunk.load(xChunk, zChunk);

    thread.postMessage({
      geometry,
      xChunk,
      zChunk,
      add: true,
    });

    thread.postMessage({
      seed: createChunk.seed,
      map: true,
    });

    let chunk = 1;
    let count = 0;
    let side = 1;
    let x = -chunk;
    let z = -chunk;
    const callWorker = () => {
      if (count === chunk * 2) {
        side += 1;
        count = 0;
      }
      switch (side) {
        case 1: z = -chunk; if (count) x += 1; else x = -chunk; break;
        case 2: x = chunk; if (count) z += 1; else z = -chunk; break;
        case 3: z = chunk; if (count) x -= 1; else x = chunk; break;
        case 4: x = -chunk; if (count) z -= 1; else z = chunk; break;
        case 5: side = 1; chunk += 1; x = -chunk; z = -chunk; break;
        default: break;
      }
      if (chunk === RENDER_DISTANCE) {
        clearInterval(workerInterval);
      } else {
        geometry = createChunk.load(x, z);

        thread.postMessage({
          geometry,
          xChunk: x,
          zChunk: z,
          add: true,
        });
        count += 1;
      }
    };
    workerInterval = setInterval(callWorker, DEFAULT_INTERVAL);
  }
  if (event.data.update) {
    const {
      oldChunkX, oldChunkZ, newChunkX, newChunkZ,
    } = event.data;
    const xMove = oldChunkX - newChunkX;
    const zMove = oldChunkZ - newChunkZ;

    const xBiasAdd = oldChunkX + RENDER_DISTANCE * (-xMove);
    const zBiasAdd = oldChunkZ + RENDER_DISTANCE * (-zMove);
    const xBiasRemove = oldChunkX - (RENDER_DISTANCE - 1) * (-xMove);
    const zBiasRemove = oldChunkZ - (RENDER_DISTANCE - 1) * (-zMove);

    // move X axis
    if (xMove && !zMove) {
      for (let i = oldChunkZ - (RENDER_DISTANCE - 1); i < oldChunkZ + RENDER_DISTANCE; i += 1) {
        // setTimeout(() => {
        const geometry = createChunk.load(xBiasAdd, i);
        thread.postMessage({
          geometry,
          xChunk: xBiasAdd,
          zChunk: i,
          add: true,
        });
        thread.postMessage({
          xChunk: xBiasRemove,
          zChunk: i,
          remove: true,
        });
        // }, DEFAULT_INTERVAL * i);
      }
    }

    // move Z axis
    if (zMove && !xMove) {
      for (let i = oldChunkX - (RENDER_DISTANCE - 1); i < oldChunkX + RENDER_DISTANCE; i += 1) {
        // setTimeout(() => {
        const geometry = createChunk.load(i, zBiasAdd);
        thread.postMessage({
          geometry,
          xChunk: i,
          zChunk: zBiasAdd,
          add: true,
        });
        thread.postMessage({
          xChunk: i,
          zChunk: zBiasRemove,
          remove: true,
        });
        // }, DEFAULT_INTERVAL * i);
      }
    }

    // move X and Z axis
    if (xMove && zMove) {
      console.log('NEED TO FIX THIS BUG');
    }
  }
});