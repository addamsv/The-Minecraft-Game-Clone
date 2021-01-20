import {
  PerspectiveCamera,
  Euler,
  EventDispatcher,
  Vector3,
} from 'three';
import PointerLockInterface from './pointerLockInterface';

class PointerLock extends EventDispatcher implements PointerLockInterface {
  public camera: PerspectiveCamera;

  private domElement: HTMLElement;

  public isLocked: boolean;

  private minPolarAngle: number;

  private maxPolarAngle: number;

  private changeEvent: any;

  private lockEvent: any;

  private unlockEvent: any;

  private euler: Euler;

  private vec: Vector3;

  public SPEED: number;

  private PI_2: number;

  constructor(camera: PerspectiveCamera, domElement: HTMLElement) {
    super();
    this.camera = camera;
    this.domElement = domElement;
    this.isLocked = false;
    this.minPolarAngle = 0;
    this.maxPolarAngle = Math.PI;

    this.changeEvent = { type: 'change' };
    this.lockEvent = { type: 'lock' };
    this.unlockEvent = { type: 'unlock' };

    this.euler = new Euler(0, 0, 0, 'YXZ');
    this.vec = new Vector3();
    this.SPEED = 1.5;
    this.PI_2 = Math.PI / 2;
    this.connect();
  }

  public moveForward(distance: number) {
    this.vec.setFromMatrixColumn(this.camera.matrix, 0);
    this.vec.crossVectors(this.camera.up, this.vec);
    this.camera.position.addScaledVector(this.vec, distance * this.SPEED);
  }

  public moveRight(distance: number) {
    this.vec.setFromMatrixColumn(this.camera.matrix, 0);
    this.camera.position.addScaledVector(this.vec, distance * this.SPEED);
  }

  public lock() {
    this.domElement.requestPointerLock();
  }

  public unlock() {
    this.domElement.ownerDocument.exitPointerLock();
  }

  // public getDirection() {
  //   const direction = new Vector3(0, 0, -1);
  //   return (v: any) => v.copy(direction).applyQuaternion(this.camera.quaternion);
  // }

  private onMouseMove(event: any) {
    if (this.isLocked === false) return;
    const { movementX } = event;
    const { movementY } = event;
    this.euler.setFromQuaternion(this.camera.quaternion);
    this.euler.y -= movementX * 0.004;
    this.euler.x -= movementY * 0.004;
    this.euler.x = Math.max(
      this.PI_2 - this.maxPolarAngle,
      Math.min(this.PI_2 - this.minPolarAngle, this.euler.x),
    );
    this.camera.quaternion.setFromEuler(this.euler);
    this.dispatchEvent(this.changeEvent);
  }

  private onPointerlockChange() {
    if (this.domElement.ownerDocument.pointerLockElement === this.domElement) {
      this.dispatchEvent(this.lockEvent);
      this.isLocked = true;
    } else {
      this.dispatchEvent(this.unlockEvent);
      this.isLocked = false;
    }
  }

  private connect() {
    this.domElement.ownerDocument.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.domElement.ownerDocument.addEventListener('pointerlockchange', this.onPointerlockChange.bind(this));
  }

  // private disconnect() {
  //   this.domElement.ownerDocument.removeEventListener('mousemove', this.onMouseMove);
  //   this.domElement.ownerDocument
  //     .removeEventListener('pointerlockchange', this.onPointerlockChange);
  // }
}

export default PointerLock;
