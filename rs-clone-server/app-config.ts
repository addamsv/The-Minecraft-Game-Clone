export default {
  debugMode: false,
  dbName: 'rs-clone-server',
  collectionName: 'players',
  collectionTokens: 'tokens',
  collectionPlayerSettings: 'player_settings',
  collectionPlayerStatistics: 'player_statistics',
  MONGO_DB_URL: process.env.MONGO_DB_URL,
  TOKEN_KEY: process.env.TOKEN_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
};
