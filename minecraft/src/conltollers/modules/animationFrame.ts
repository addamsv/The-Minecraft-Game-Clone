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
    requestAnimationFrame(this.animate.bind(this));
    const time = performance.now();
    if (game.control.isLocked === true) {
      game.raycaster.ray.origin.copy(game.control.getObject().position);
      game.raycaster.ray.origin.y -= 10;
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
      if (onObject === true) {
        game.speed.y = Math.max(0, game.speed.y);
        game.jump = true;
      }
      game.control.moveRight(-game.speed.x * delta);
      game.control.moveForward(-game.speed.z * delta);
      game.control.getObject().position.y += (game.speed.y * delta);
      if (game.control.getObject().position.y < 10) {
        game.speed.y = 0;
        game.control.getObject().position.y = 10;
        game.jump = true;
      }
    }
    game.time = time;
    game.renderer.render(game.scene, game.camera);
  }
}

export default AnimationFrame;
