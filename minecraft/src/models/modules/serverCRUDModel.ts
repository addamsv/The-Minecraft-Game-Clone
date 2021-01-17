import axios from 'axios';
import { ItemType } from './storageItemType';
import ServerCRUDModelInterface from './serverCRUDModelInterface';
import env from '../../configs/environmentVars';

class ServerCRUDModel implements ServerCRUDModelInterface {
  private temp: String;

  private baseURL: any;

  constructor() {
    this.temp = '';
    this.baseURL = env.serverHost;
  }

  public async auth(data: any, token?: String): Promise<ItemType[]> {
    const baseURL = <any>(this.baseURL);

    const headers = { Authorization: token };

    const RESPONSE = await axios({
      baseURL,
      url: '/players/auth',
      headers,
      data,
    });

    return RESPONSE.data;
  }

  public async get(): Promise<ItemType[]> {
    const baseURL = <any>(this.baseURL);

    const RESPONSE = await axios({
      baseURL,
      url: '/players',
    });

    return RESPONSE.data;
  }

  public async create(data: ItemType): Promise<ItemType> {
    const baseURL = <any>(this.baseURL);

    const RESPONSE = await axios({
      baseURL,
      method: 'post',
      data,
      url: '/players',
    });

    return RESPONSE.data;
  }

  public async save(data: ItemType): Promise<ItemType> {
    const baseURL = <any>(this.baseURL);

    const RESPONSE = await axios({
      baseURL,
      method: 'put',
      data,
      url: `/players/${data.id}`,
    });

    return RESPONSE.data;
  }

  public async remove(data: ItemType): Promise<void> {
    const baseURL = <any>(this.baseURL);

    const RESPONSE = await axios({
      baseURL,
      method: 'delete',
      url: `/players/${data.id}`,
    });

    return RESPONSE.data;
  }
}

export { ServerCRUDModelInterface, ServerCRUDModel };
