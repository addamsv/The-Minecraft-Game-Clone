import PlayerController from './conltollers/keyboard';
import './index.scss';

const move = new PlayerController();

const start = document.querySelector('.start');

function loadWorld() {
  start.remove();
  move.createKeyboardControls();
}

start.addEventListener('click', loadWorld);
