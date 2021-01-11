export default {
  tokenKey: '1a2b-3c4d-5e6f-7g8h',
  dbName: 'rs-clone-server',
  dbLogin: 'rsmaincraftserver',
  dbPassword: 'rsmaincraftserver2020q3',
  collectionName: 'players',
  getUrl() {
    return `mongodb+srv://${this.dbLogin}:${this.dbPassword}@cluster0.fnt9p.mongodb.net/?retryWrites=true&w=majority`;
  },
};
