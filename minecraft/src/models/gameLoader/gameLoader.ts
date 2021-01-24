/* eslint-disable no-param-reassign */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import GameLoaderInterface from './gameLoaderInterface';

class GameLoader implements GameLoaderInterface {
  private gameModel: any;

  private textureLoader: THREE.TextureLoader;

  private gltfLoader: GLTFLoader;

  constructor(gameModel: any) {
    this.gameModel = gameModel;
    this.textureLoader = new THREE.TextureLoader();
    this.gltfLoader = new GLTFLoader();
  }

  public loadTextures() {
    const grassTexture = this.textureLoader.load('../assets/textures/grassAtlas.png');
    grassTexture.magFilter = THREE.NearestFilter;
    grassTexture.minFilter = THREE.LinearMipmapLinearFilter;
    grassTexture.name = 'grassTexture';
    this.gameModel.setTexture(grassTexture);
    const sandTexture = this.textureLoader.load('../assets/textures/sandAtlas.png');
    sandTexture.magFilter = THREE.NearestFilter;
    sandTexture.minFilter = THREE.LinearMipmapLinearFilter;
    sandTexture.name = 'sandTexture';
    this.gameModel.setTexture(sandTexture);
  }

  public loadObjects() {
    this.gltfLoader.load(
      './assets/meshes/oakSmall.glb',
      (gltf: any) => {
        const smallTree = gltf.scene;
        smallTree.traverse((node: THREE.Mesh) => {
          node.receiveShadow = true;
        });
        smallTree.scale.set(15, 15, 15);
        smallTree.name = 'smallTree';
        this.gameModel.setObject(smallTree);
      },
    );
    this.gltfLoader.load(
      './assets/meshes/oakLarge.glb',
      (gltf: any) => {
        const largeTree = gltf.scene;
        largeTree.traverse((node: THREE.Mesh) => {
          node.receiveShadow = true;
        });
        largeTree.scale.set(15, 15, 15);
        largeTree.name = 'largeTree';
        this.gameModel.setObject(largeTree);
      },
    );
  }

  public loadPlayer(token: string) {
    this.gltfLoader.load(
      './assets/meshes/character.glb',
      (gltf: any) => {
        const playerMesh = gltf.scene;
        playerMesh.traverse((node: THREE.Mesh) => {
          node.receiveShadow = true;
        });
        playerMesh.scale.set(9, 9, 9);
        playerMesh.position.y = 700;
        playerMesh.name = token;
        this.gameModel.setPlayer(playerMesh);
      },
    );
  }
}

export default GameLoader;
