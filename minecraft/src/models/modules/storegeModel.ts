import StorageModelInterface from './storageModelInterface';
// import env from '../../configs/environmentVars';
import MainControllerInterface from '../../controllers/mainControllerInterface';

class StorageModel implements StorageModelInterface {
  private controller: MainControllerInterface;

  private temp: String;

  constructor(controller: MainControllerInterface) {
    this.controller = controller;
    this.temp = 'a';
  }

  sendStatToServer(stat: String) {
    console.log(this.temp, stat);
  }

  getStatFromServer(requiredStat: String) {
    console.log(this.temp);
    return requiredStat;
  }

  sendStatToLocalStorage(stat: String) {
    console.log(this.temp, stat);
  }

  getStatFromLocalStorage(requiredStat: String) {
    console.log(this.temp);
    return requiredStat;
  }

  sendSettsToServer(setts: String) {
    console.log(this.temp, setts);
  }

  getSettsFromServer(requiredSetts: String) {
    console.log(this.temp);
    return requiredSetts;
  }

  sendSettsToLocalStorage(setts: String) {
    console.log(this.temp, setts);
  }

  getSettsFromLocalStorage(requiredSetts: String) {
    console.log(this.temp);
    return requiredSetts;
  }
}

export { StorageModelInterface, StorageModel };
