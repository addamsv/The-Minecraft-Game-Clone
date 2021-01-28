interface GameViewInterface {
  attachView(): void;
  removeView(): void;
  showLanternCooldown(): void;
  addLanternClass(): void;
  removeLanternClass(): void;
  showSwordCooldown(): void;
  addSwordClass(): void;
  removeSwordClass(): void;
}

export default GameViewInterface;
