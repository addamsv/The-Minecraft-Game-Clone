import { ItemType } from './storageItemType';
/* eslint-disable no-unused-vars */

interface ServerCRUDModelInterface {
  get(): Promise<ItemType[]>;

  create(data: any): Promise<any>;

  save(data: ItemType): Promise<ItemType>;

  remove(data: ItemType): void;

  login(data: any, token?: String): Promise<any>;
}

export default ServerCRUDModelInterface;
