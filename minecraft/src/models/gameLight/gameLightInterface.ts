/* eslint-disable no-unused-vars */
import * as THREE from 'three';

interface GameLightInterface {
  isNight: boolean;
  createLight(): void;
  setSunligntPosition(position: THREE.Vector3): void;
  setSunlightAngle(time: number): void;
  addLanternToScene(): void;
  removeLanternFromScene(): void;
  startDay(): void;
}

export default GameLightInterface;
