/* eslint-disable no-loop-func, no-restricted-globals */

import * as THREE from 'three';
import * as Noise from 'simplex-noise';

const thread: Worker = self as any;

const BLOCK_SIZE = 10;
const CHUNK_SIZE = 16;
const RENDER_DISTANCE = 6;
const DEFAULT_INTERVAL = 120;
const SPLIT_GROUND = -8.7;
const ACCURACY = 60;
const UNFLATNESS = 30;

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

const z1Geometry = new THREE.PlaneGeometry(BLOCK_SIZE, BLOCK_SIZE);
z1Geometry.faceVertexUvs[0][0][0].y = 0.5;
z1Geometry.faceVertexUvs[0][0][2].y = 0.5;
z1Geometry.faceVertexUvs[0][1][2].y = 0.5;
z1Geometry.translate(0, 0, 5);

const z2Geometry = new THREE.PlaneGeometry(BLOCK_SIZE, BLOCK_SIZE);
z2Geometry.faceVertexUvs[0][0][0].y = 0.5;
z2Geometry.faceVertexUvs[0][0][2].y = 0.5;
z2Geometry.faceVertexUvs[0][1][2].y = 0.5;
z2Geometry.rotateY(Math.PI);
z2Geometry.translate(0, 0, -5);

class CreateChunk {
  data: Array<number>;

  seed: string;

  perlin: Noise;

  constructor(seed: string) {
    this.data = [];
    this.seed = seed;
    this.perlin = new Noise(this.seed);
  }

  generateHeight(xChunk: number, zChunk: number) {
    const xFrom = xChunk * CHUNK_SIZE;
    const zFrom = zChunk * CHUNK_SIZE;
    let index = 0;
    for (let x = xFrom; x < xFrom + CHUNK_SIZE; x += 1) {
      for (let z = zFrom; z < zFrom + CHUNK_SIZE; z += 1) {
        this.data[index] = this.perlin.noise2D(x / ACCURACY, z / ACCURACY) * UNFLATNESS;
        index += 1;
      }
    }
  }

  getY(x: number, z:number) {
    return Math.trunc(this.data[x * CHUNK_SIZE + z] / 5) || 0;
  }

  getNoise(x: number, z: number) {
    return this.data[x * CHUNK_SIZE + z];
  }

  load(xChunk: number, zChunk: number) {
    this.generateHeight(xChunk, zChunk);

    const matrix = new THREE.Matrix4();
    const geometry = new THREE.Geometry();
    const waterGeometry = new THREE.Geometry();
    const sandGeometry = new THREE.Geometry();
    const queue: Array<object> = [];

    for (let x = 0; x < CHUNK_SIZE; x += 1) {
      for (let z = 0; z < CHUNK_SIZE; z += 1) {
        const y = this.getY(x, z);
        if (y === 0 && Math.random() < 0.01) {
          queue.push({
            tree: true, small: true, x, y, z, xChunk, zChunk,
          });
        }
        if (y === 3 && Math.random() < 0.01) {
          queue.push({
            tree: true, large: true, x, y, z, xChunk, zChunk,
          });
        }

        matrix.makeTranslation(
          x * BLOCK_SIZE,
          y * BLOCK_SIZE,
          z * BLOCK_SIZE,
        );

        if (this.data[x * CHUNK_SIZE + z] >= SPLIT_GROUND) {
          geometry.merge(y1Geometry, matrix);

          if ((this.getY(x + 1, z) !== y
          && this.getY(x + 1, z) !== y + 1) || x === CHUNK_SIZE - 1) {
            geometry.merge(x1Geometry, matrix);
          }
          if ((this.getY(x - 1, z) !== y && this.getY(x - 1, z) !== y + 1) || x === 0) {
            geometry.merge(x2Geometry, matrix);
          }
          if ((this.getY(x, z + 1) !== y
          && this.getY(x, z + 1) !== y + 1) || z === CHUNK_SIZE - 1) {
            geometry.merge(z1Geometry, matrix);
          }
          if ((this.getY(x, z - 1) !== y && this.getY(x, z - 1) !== y + 1) || z === 0) {
            geometry.merge(z2Geometry, matrix);
          }
        }
        if (this.data[x * CHUNK_SIZE + z] < SPLIT_GROUND) {
          sandGeometry.merge(y1Geometry, matrix);

          if ((this.getY(x + 1, z) !== y
          && this.getY(x + 1, z) !== y + 1) || x === CHUNK_SIZE - 1) {
            sandGeometry.merge(x1Geometry, matrix);
          }
          if ((this.getY(x - 1, z) !== y && this.getY(x - 1, z) !== y + 1) || x === 0) {
            sandGeometry.merge(x2Geometry, matrix);
          }
          if ((this.getY(x, z + 1) !== y
          && this.getY(x, z + 1) !== y + 1) || z === CHUNK_SIZE - 1) {
            sandGeometry.merge(z1Geometry, matrix);
          }
          if ((this.getY(x, z - 1) !== y && this.getY(x, z - 1) !== y + 1) || z === 0) {
            sandGeometry.merge(z2Geometry, matrix);
          }
        }
        matrix.makeTranslation(
          x * BLOCK_SIZE,
          -2 * BLOCK_SIZE,
          z * BLOCK_SIZE,
        );
        if (y < -2) {
          waterGeometry.merge(y1Geometry, matrix);
        }
      }
    }
    queue.forEach((item: any, index: number) => {
      thread.postMessage({
        x: item.x * BLOCK_SIZE,
        y: item.y * BLOCK_SIZE,
        z: item.z * BLOCK_SIZE,
        xChunk: item.xChunk,
        zChunk: item.zChunk,
        tree: true,
        small: item.small,
        large: item.large,
        last: !queue[index + 1],
      });
    });

    return { geometry, sandGeometry, waterGeometry };
  }
}

let createChunk: CreateChunk = null;
let workerInterval: any;

thread.addEventListener('message', (event: any) => {
  if (event.data.seed) {
    createChunk = new CreateChunk(event.data.seed);
  }

  if (event.data.load) {
    const { xChunk, zChunk } = event.data;

    let { geometry, sandGeometry, waterGeometry } = createChunk.load(xChunk, zChunk);

    thread.postMessage({
      geometry,
      sandGeometry,
      waterGeometry,
      xChunk,
      zChunk,
      add: true,
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
        thread.postMessage({
          unlockPosition: true,
        });
        clearInterval(workerInterval);
      } else {
        const returnChunk = createChunk.load(x, z);
        geometry = returnChunk.geometry;
        waterGeometry = returnChunk.waterGeometry;
        sandGeometry = returnChunk.sandGeometry;

        thread.postMessage({
          geometry,
          sandGeometry,
          waterGeometry,
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

    if (xMove && !zMove) {
      for (let i = oldChunkZ - (RENDER_DISTANCE - 1); i < oldChunkZ + RENDER_DISTANCE; i += 1) {
        setTimeout(() => {
          const returnChunk = createChunk.load(xBiasAdd, i);
          const { geometry, sandGeometry, waterGeometry } = returnChunk;
          thread.postMessage({
            geometry,
            sandGeometry,
            waterGeometry,
            xChunk: xBiasAdd,
            zChunk: i,
            add: true,
          });
          thread.postMessage({
            xChunk: xBiasRemove,
            zChunk: i,
            remove: true,
          });
        }, DEFAULT_INTERVAL * i);
      }
    }

    if (zMove && !xMove) {
      for (let i = oldChunkX - (RENDER_DISTANCE - 1); i < oldChunkX + RENDER_DISTANCE; i += 1) {
        setTimeout(() => {
          const returnChunk = createChunk.load(i, zBiasAdd);
          const { geometry, sandGeometry, waterGeometry } = returnChunk;
          thread.postMessage({
            geometry,
            sandGeometry,
            waterGeometry,
            xChunk: i,
            zChunk: zBiasAdd,
            add: true,
          });
          thread.postMessage({
            xChunk: i,
            zChunk: zBiasRemove,
            remove: true,
          });
        }, DEFAULT_INTERVAL * i);
      }
    }

    if (xMove && zMove) {
      for (let i = 0; i <= (RENDER_DISTANCE - 1) * 2; i += 1) {
        setTimeout(() => {
          const returnChunk = createChunk.load(xBiasAdd + i * xMove, zBiasAdd);
          const { geometry, sandGeometry, waterGeometry } = returnChunk;
          thread.postMessage({
            geometry,
            sandGeometry,
            waterGeometry,
            xChunk: xBiasAdd + i * xMove,
            zChunk: zBiasAdd,
            add: true,
          });
          thread.postMessage({
            xChunk: xBiasRemove - i * xMove,
            zChunk: zBiasRemove,
            remove: true,
          });
        }, i * DEFAULT_INTERVAL);
      }
      for (let i = 1; i <= (RENDER_DISTANCE - 1) * 2; i += 1) {
        setTimeout(() => {
          const returnChunk = createChunk.load(xBiasAdd, zBiasAdd + i * zMove);
          const { geometry, sandGeometry, waterGeometry } = returnChunk;
          thread.postMessage({
            geometry,
            sandGeometry,
            waterGeometry,
            xChunk: xBiasAdd,
            zChunk: zBiasAdd + i * zMove,
            add: true,
          });
          thread.postMessage({
            xChunk: xBiasRemove,
            zChunk: zBiasRemove - i * zMove,
            remove: true,
          });
        }, i * DEFAULT_INTERVAL);
      }
    }
  }
});
