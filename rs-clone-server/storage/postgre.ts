/* eslint-disable class-methods-use-this */
import * as initKnex from 'knex';
import { ItemType } from '../types/item';
import appConfig from '../app-config';

const knex = initKnex({
  client: 'pg',
  connection: appConfig.DATABASE_URL,
  // debug: true,
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
  const isTransactionOk = await knex.transaction((t) => knex(appConfig.collectionName)
    .transacting(t)
    .insert({ id, password, login })
    .then(() => knex(appConfig.collectionTokens)
      .transacting(t)
      .insert({ uuid: id })
      .then(() => knex(appConfig.collectionPlayerSettings)
        .transacting(t)
        .insert({ uuid: id })
        .then(() => knex(appConfig.collectionPlayerStatistics)
          .transacting(t)
          .insert({ uuid: id }))))
    .then(t.commit)
    .catch(t.rollback))
    .then(() => true) // ok
    .catch(() => false); // transaction failed, data rolled back

  return isTransactionOk;
  // const list = await knex(appConfig.collectionName)
  //   .insert({ id, password, login })
  //   .returning('*');

  // return list[0];
};

const setToken = async (uuid: any, token: any) => {
  const list = await knex(appConfig.collectionTokens)
    .update({ token })
    .where({ uuid })
    .returning('*');

  return list[0];
};

const updatePassword = async (id: any, password: any) => {
  const list = await knex(appConfig.collectionName)
    .update({ password })
    .where({ id })
    .returning('*');

  return list[0];
};

const logOutById = async (uuid: any) => {
  const token = null;
  const list = await knex(appConfig.collectionTokens)
    .update({ token })
    .where({ uuid })
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
  logOutById,
  updatePassword,
  create,
  setToken,
  update,
  remove,
};
