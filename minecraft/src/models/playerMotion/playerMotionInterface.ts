/* eslint-disable no-unused-vars */

import { Mesh } from 'three';
import PlayerMoveData from './PlayerMoveData';

interface PlayerMotionInterface {
  connectPlayer(token: string): void;
  movePlayer(data: PlayerMoveData): void;
  disconnectPlayer(token: string): void;
  smoothPlayerMotion(data: PlayerMoveData, mesh: Mesh): void;
}

export default PlayerMotionInterface;
