import { PointerLockControls } from '../controllers/modules/pointerLockControls.js';
import Game from '../models/modules/gameInit';

interface GameInterface extends Game {
  forward?: boolean;
  left?: boolean;
  backward?: boolean;
  right?: boolean;
  jump?: boolean;
  control?: PointerLockControls;
}

export default GameInterface;
