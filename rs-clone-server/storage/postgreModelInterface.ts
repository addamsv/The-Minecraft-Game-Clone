/* eslint-disable no-unused-vars */
type ItemType = {
  id: string;
  password: string;
  login: string;
}

interface PostgreInterface {
  listAll(): any;

  score(): any;

  getLogin(userLogin: string): any;

  getById(id: string): any;

  create(item: ItemType): any;

  setToken(uuid: any, token: any): any;

  updatePassword(id: any, password: any): any;

  logOutById(uuid: any): any;

  update(item: ItemType): any;

  remove(id: string): void;
}
export default PostgreInterface;
