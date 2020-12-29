import { Vector3 } from 'three';
import GameInterface from '../../interfaces/gameInterface';

const WEIGHT = 50.0;

class AnimationFrame {
  game: GameInterface;

  constructor(game: GameInterface) {
    this.game = game;
    this.animate();
  }

  animate() {
    const { game } = this;
    game.jump = false;
    requestAnimationFrame(this.animate.bind(this));
    const time = performance.now();
    if (game.control.isLocked === true) {
      game.raycaster.ray.origin.copy(game.camera.position);
      game.raycaster.ray.origin.y -= 15;
      const intersections = game.raycaster.intersectObjects(game.collision);
      const onObject = intersections.length > 0;

      const delta = (time - game.time) / 1000;
      game.speed.x -= game.speed.x * 10.0 * delta;
      game.speed.z -= game.speed.z * 10.0 * delta;
      game.speed.y -= 9.8 * WEIGHT * delta;
      game.direction.z = Number(game.forward) - Number(game.backward);
      game.direction.x = Number(game.right) - Number(game.left);

      game.direction.normalize();
      if (game.forward || game.backward) {
        game.speed.z -= game.direction.z * 400.0 * delta;
      }
      if (game.left || game.right) {
        game.speed.x -= game.direction.x * 400.0 * delta;
      }

      if (onObject) {
        game.speed.y = Math.max(0, game.speed.y);
        game.jump = true;
      }

      const ray = new Vector3();
      const { x, y, z } = game.camera.position;
      ray.x = x; ray.y = y - 10; ray.z = z;
      game.raycaster.ray.origin.copy(ray);
      const wallCheck = game.raycaster.intersectObjects(game.collision);

      if (wallCheck.length) {
        game.speed.z = 0;
        game.speed.x = 0;
        game.speed.y += 30;
      }

      game.control.moveRight(-game.speed.x * delta);
      game.control.moveForward(-game.speed.z * delta);
      game.camera.position.y += (game.speed.y * delta);
    }
    game.time = time;
    game.renderer.render(game.scene, game.camera);
  }
}

export default AnimationFrame;
