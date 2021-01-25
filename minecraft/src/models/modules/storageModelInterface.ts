/* eslint-disable no-unused-vars */
import ServerSocketModelInterface from './ServerSocketModelInterface';

interface StorageModelInterface {

  /**
   * Init StorageModel when Socket is ready
   * @param socket Socket
   */
  init(socket: ServerSocketModelInterface): void;

  /**
   *
   *      STATISTICS
   *
   */

  /** Answer will be in the socket
   * this.model.storageModel.sendStatQueryToServer('{"ask": "setStat", "item1": "chicky-shpoky"}');
   *
   ** In order to Send Statistics To the Heroku Server Through Socket
   * @param stat - example:
   * warning! required: {"ask": "setStat", ... }
   *
   * * In order to Get Statistics from the Heroku Server Through Socket
   * @param requiredStat - example: `{"getStat": "${yourID}", "getStat": "all"}`
   * warning! required: {"ask": "getStat", ... }
   */
  sendStatQueryToServer(stat: String): void;

  /**
   *  Send Statistics To the LocalStorage
   *
   * @param stat - example: `{"item1": "${itemVal1}, ...}`
   */
  sendStatToLocalStorage(stat: String): void;

  /**
   *  Get Statistics from the LocalStorage
   *
   * @param requiredStat - example: `getStat`
   */
  getStatFromLocalStorage(requiredStat: String): String;

  /**
   *
   *      SETTINGS
   *
   */

  /** Answer will be in the socket
  * this.model.storageModel.sendSettsQueryToServer('{"ask": "setSetts", "item1": "chicky-shpoky"}');
   *
   *  Send Settings To the Heroku Server Through Socket
   * @param stat - example: `{"ask": "setSetts", "item1": "${itemVal1}, ...}`
   * warning! required: {"ask": "setSetts", ... }
   *
   ** Get Settings from the Heroku Server Through Socket
   * @param requiredSetts - example: `{"ask": "getSetts", "getSetts": "all"}`
   * warning! required: {"ask": "getSetts", ... }
   */
  sendSettsQueryToServer(setts: String): void;

  /**
   *  Send Settings To the LocalStorage
   *
   * @param setts - example: `{"item1": "${itemVal1}, ...}`
   */
  sendSettsToLocalStorage(setts: String): void;

  /**
   *  Get Settings from the LocalStorage
   *
   * @param requiredSetts - example: `getSetts`
   */
  getSettsFromLocalStorage(requiredSetts: String): String;
}

export default StorageModelInterface;
