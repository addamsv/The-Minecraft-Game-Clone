/* eslint-disable no-unused-vars */
interface StorageModelInterface {

  /**
   *
   *      STATISTICS
   *
   */

  /**
   *  Send Statistics To the Heroku Server Through Socket
   *
   * @param stat - example: `0{"setStat": "${yourID}", "item1": "${itemVal1}, ...}`
   *
   * warning! required: 0{"setStat": "${yourID}"
   */
  sendStatToServer(stat: String): void;

  /**
   *  Get Statistics from the Heroku Server Through Socket
   *
   * @param requiredStat - example: `0{"getStat": "${yourID}", "getStat": "all"}`
   *
   * warning! required: 0{"getStat": "${yourID}"
   */
  getStatFromServer(requiredStat: String): String;

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

  /**
   *  Send Settings To the Heroku Server Through Socket
   *
   * @param stat - example: `0{"setSetts": "${yourID}", "item1": "${itemVal1}, ...}`
   *
   * warning! required: 0{"setSetts": "${yourID}"
   */
  sendSettsToServer(setts: String): void;

  /**
   *  Get Settings from the Heroku Server Through Socket
   *
   * @param requiredSetts - example: `0{"getSetts": "${yourID}", "getSetts": "all"}`
   *
   * warning! required: 0{"getSetts": "${yourID}"
   */
  getSettsFromServer(requiredSetts: String): String;

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
