import { ItemType } from './storageItemType';
/* eslint-disable no-unused-vars */

interface ServerCRUDModelInterface {
  get(): Promise<ItemType[]>;

  create(data: ItemType): Promise<ItemType>;

  save(data: ItemType): Promise<ItemType>;

  remove(data: ItemType): void;
}

export default ServerCRUDModelInterface;
