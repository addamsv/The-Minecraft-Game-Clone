import {
  Euler,
  EventDispatcher,
  Vector3,
} from 'three';

const SPEED = 2;

const PointerLockControls = function(camera, domElement) {
  this.domElement = domElement;
  this.isLocked = false;
  this.minPolarAngle = 0;
  this.maxPolarAngle = Math.PI;
  const scope = this;
  const changeEvent = { type: 'change' };
  const lockEvent = { type: 'lock' };
  const unlockEvent = { type: 'unlock' };
  const euler = new Euler(0, 0, 0, 'YXZ');
  const PI_2 = Math.PI / 2;
  const vec = new Vector3();

  function onMouseMove(event) {
    if (scope.isLocked === false) return;
    const { movementX } = event;
    const { movementY } = event;
    euler.setFromQuaternion(camera.quaternion);
    euler.y -= movementX * 0.004;
    euler.x -= movementY * 0.004;
    euler.x = Math.max(PI_2 - scope.maxPolarAngle, Math.min(PI_2 - scope.minPolarAngle, euler.x));
    camera.quaternion.setFromEuler(euler);
    scope.dispatchEvent(changeEvent);
  }

  function onPointerlockChange() {
    if (scope.domElement.ownerDocument.pointerLockElement === scope.domElement) {
      scope.dispatchEvent(lockEvent);
      scope.isLocked = true;
    } else {
      scope.dispatchEvent(unlockEvent);
      scope.isLocked = false;
    }
  }

  this.connect = () => {
    scope.domElement.ownerDocument.addEventListener('mousemove', onMouseMove);
    scope.domElement.ownerDocument.addEventListener('pointerlockchange', onPointerlockChange);
  };

  this.disconnect = () => {
    scope.domElement.ownerDocument.removeEventListener('mousemove', onMouseMove);
    scope.domElement.ownerDocument.removeEventListener('pointerlockchange', onPointerlockChange);
  };

  this.dispose = () => {
    this.disconnect();
  };

  this.getObject = () => camera;

  this.getDirection = () => {
    const direction = new Vector3(0, 0, -1);
    return (v) => v.copy(direction).applyQuaternion(camera.quaternion);
  };

  this.moveForward = (distance) => {
    vec.setFromMatrixColumn(camera.matrix, 0);
    vec.crossVectors(camera.up, vec);
    camera.position.addScaledVector(vec, distance * SPEED);
  };

  this.moveRight = (distance) => {
    vec.setFromMatrixColumn(camera.matrix, 0);
    camera.position.addScaledVector(vec, distance * SPEED);
  };

  this.lock = () => {
    this.domElement.requestPointerLock();
  };

  this.unlock = () => {
    scope.domElement.ownerDocument.exitPointerLock();
  };

  this.connect();
};

PointerLockControls.prototype = Object.create(EventDispatcher.prototype);
PointerLockControls.prototype.constructor = PointerLockControls;

export { PointerLockControls };
