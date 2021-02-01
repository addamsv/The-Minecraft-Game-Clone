/* eslint-disable no-unused-vars */
import { ItemType } from '../types/item';

interface PostgreInterface {
  listAll(): any;

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
