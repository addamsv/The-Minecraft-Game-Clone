import { PointerLockControls } from '../conltollers/modules/pointerLockControls.js';
import Game from '../models/game';

interface GameInterface extends Game {
  forward?: boolean;
  left?: boolean;
  backward?: boolean;
  right?: boolean;
  jump?: boolean;
  control?: PointerLockControls;
}

export default GameInterface;
