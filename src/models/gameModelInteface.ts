/* eslint-disable no-unused-vars */

import {
  PerspectiveCamera,
  WebGLRenderer,
  Vector3,
  Texture,
  Object3D,
} from 'three';
import SoundModelInterface from './soundModel/soundModelInterface';
import PointerLockInterface from '../controllers/pointerLock/pointerLockInterface';
import GameLightInterface from './gameLight/gameLightInterface';

interface GameModelInterace {
  camera: PerspectiveCamera;

  renderer: WebGLRenderer;

  seed: string;

  speed: Vector3;

  forward: boolean;

  left: boolean;

  backward: boolean;

  right: boolean;

  jump: boolean;

  control: PointerLockInterface;

  sound: SoundModelInterface;

  jumpSound: boolean;

  isLockPosition: number;

  isShiftPressed: boolean;

  gameLight: GameLightInterface;

  destroyWorld(): void;

  setTexture(texture: Texture): void;

  setObject(object: Object3D): void;

  loadPlayer(token: string): void;

  setPlayer(player: Object3D): void;

  setAnimation(animation: any): void;

  removePlayer(token: string): void;

  setView(views: any): void;

  changeSwordStatus(): void;

  hitSword(): void;

  changeLanternStatus(): void;

  generateWorld(seed: string): void;

  animationFrame(): void;
}

export default GameModelInterace;
