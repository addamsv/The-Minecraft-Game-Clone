import * as initKnex from 'knex';
import { ItemType } from '../types/item';
import appConfig from '../app-config';

const knex = initKnex({
  client: 'pg',
  connection: appConfig.DATABASE_URL,
  debug: true,
});

const listAll = async () => {
  const list = await knex(appConfig.collectionName).select();

  return list;
};

const getLogin = async (userLogin: string) => {
  const list = await knex(appConfig.collectionName)
    .select()
    .where('login', userLogin);

  return list[0];
};

const getById = async (id: string) => {
  const list = await knex(appConfig.collectionName)
    .select()
    .where({ id });

  return list[0];
};

const create = async (item: ItemType) => {
  const { id, password, login } = item;

  const list = await knex(appConfig.collectionName)
    .insert({ id, password, login })
    .returning('*');

  return list[0];
};

const update = async (item: ItemType) => {
  const { id, password, login } = item;

  const list = await knex(appConfig.collectionName)
    .update({ id, password, login })
    .where({ id })
    .returning('*');

  return list[0];
};

const remove = async (id: string) => {
  if (!id) {
    return;
  }

  await knex(appConfig.collectionName)
    .delete()
    .where({ id });
};

export {
  listAll,
  getById,
  getLogin,
  create,
  update,
  remove,
};
