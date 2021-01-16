/* eslint-disable no-unused-vars */

interface PointerLockInterface {
  moveForward(distance: number): void;
  moveRight(distance: number): void;
  lock(): void;
  unlock(): void;
  /*
  * @override
  */
  addEventListener(eventName: string, functionName: any): void;
  isLocked: boolean;
}

export default PointerLockInterface;
