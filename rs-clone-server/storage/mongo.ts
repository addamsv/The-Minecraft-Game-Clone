import { Collection, MongoClient } from 'mongodb';
import { ItemType } from '../types/item';
import appConfig from '../app-config';

const getMongoInstance = async () => {
  const client = await MongoClient.connect(
    appConfig.getUrl(),
    { useNewUrlParser: true, useUnifiedTopology: true },
  );

  return client.db(appConfig.dbName);
};

const getCollection = async (): Promise<Collection> => {
  const db = await getMongoInstance();

  return db.collection(appConfig.collectionName);
};

const listAll = async () => {
  const collection = await getCollection();

  return collection.find({}).toArray();
};

const getById = async (id: string) => {
  const collection = await getCollection();

  const data = await collection.findOne({ id });

  return data;
};

const create = async (item: ItemType) => {
  const collection = await getCollection();

  const response = await collection.insertOne(item);

  return response.ops[0];
};

const update = async (item: ItemType) => {
  const collection = await getCollection();

  const { id } = item;

  const response = await collection.replaceOne({ id }, item);

  return response.ops[0];
};

const remove = async (id: string) => {
  const collection = await getCollection();

  return collection.deleteOne({ id });
};

export {
  listAll,
  getById,
  create,
  update,
  remove,
};
