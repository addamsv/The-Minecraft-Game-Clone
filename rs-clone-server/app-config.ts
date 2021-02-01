export default {
  debugMode: false,
  dbName: 'rs-clone-server',
  collectionName: 'players',
  collectionTokens: 'tokens',
  collectionPlayerSettings: 'player_settings',
  collectionPlayerStatistics: 'player_statistics',
  TOKEN_KEY: process.env.TOKEN_KEY || '1a2b-3c4d-5e6f-7g8h',
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:@localhost:5432/postgres',
};
