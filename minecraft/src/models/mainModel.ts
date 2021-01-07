import MainModelInterface from './mainModelInterface';

class MainModel implements MainModelInterface {
  public sendCoordinates(x: number, z: number) {
    this.getCoordinates(x, z);
  }

  private a: string;

  private getCoordinates(x: number, z: number) {
    console.log(`${this.a} ${x}:${z}`);
  }
}

export { MainModelInterface, MainModel };
