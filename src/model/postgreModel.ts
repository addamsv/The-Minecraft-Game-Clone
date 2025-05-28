import * as initKnex from 'knex';
import appConfig from '../../app-config';

interface IPlayer {
  id: string;
  login: string;
  password: string;
}
interface IToken {
 uuid: string;
 token: string;
}

class Postgres {
  private knex = initKnex({
    client: 'pg',
    connection: appConfig.DATABASE_URL,
    debug: appConfig.debugMode,
  });

  // getAllPlayers
  public async listAll(): Promise<IPlayer[] | undefined> {
    const list = await this.knex<IPlayer>(appConfig.collectionName).select();

    return list;
  }

  // getAllPlayersScore
  public async score() {
    const list = await this.knex({
      a: appConfig.collectionName,
      b: appConfig.collectionPlayerStatistics,
    })
      .select({
        'User Name': 'a.login',
        Score: 'b.player_values',
      })
      .whereRaw('?? = ??', ['a.id', 'b.uuid']);

    return list;
  }

  // getPlayerValuesByUuid
  public async getUserScore(uuid: string) {
    const list = await this.knex(appConfig.collectionPlayerStatistics)
      .select('player_values')
      .where({ uuid });

    return list[0];
  }

  // putPlayerStatisticsByUuid
  // eslint-disable-next-line camelcase
  public async saveUserScore(uuid: string, player_values: string) {
    const list = await this.knex(appConfig.collectionPlayerStatistics)
      .update({ player_values })
      .where({ uuid })
      .returning('*');

    return list[0];
  }

  // getPlayerByLogin
  public async getByLogin(playerLogin: string): Promise<IPlayer | undefined> {
    const list = await this.knex<IPlayer>(appConfig.collectionName)
      .select()
      .where('login', playerLogin);

    return list[0];
  }

  // getPlayerById
  public async getById(id: string): Promise<IPlayer | undefined> {
    const list = await this.knex<IPlayer>(appConfig.collectionName)
      .select()
      .where({ id });

    return list[0];
  }

  // createPlayers
  public async create(player: IPlayer): Promise<boolean> {
    const { id, password, login } = player;

    const isTransactionOk = await this.knex.transaction(
      (t) => this.knex<IPlayer>(appConfig.collectionName)
        .transacting(t)
        .insert({ id, password, login })
        .then(() => this.knex<IToken>(appConfig.collectionTokens)
          .transacting(t)
          .insert({ uuid: id })
          .then(() => this.knex(appConfig.collectionPlayerSettings)
            .transacting(t)
            .insert({ uuid: id })
            .then(() => this.knex(appConfig.collectionPlayerStatistics)
              .transacting(t)
              .insert({ uuid: id }))))
        .then(t.commit)
        .catch(t.rollback),
    )
      .then(() => true)
      .catch(() => false);

    return isTransactionOk;
  }

  public async setToken(uuid: string, token: string): Promise<IToken | undefined> {
    const list = await this.knex<IToken>(appConfig.collectionTokens)
      .update({ token })
      .where({ uuid })
      .returning('*');

    return list[0];
  }

  // updatePlayersPassword
  public async updatePassword(id: string, password: string): Promise<IPlayer | undefined> {
    const list = await this.knex<IPlayer>(appConfig.collectionName)
      .update({ password })
      .where({ id })
      .returning('*');

    return list[0];
  }

  public async logOutById(uuid: string): Promise<IToken | undefined> {
    const token = null;

    const list = await this.knex<IToken>(appConfig.collectionTokens)
      .update({ token })
      .where({ uuid })
      .returning('*');

    return list[0];
  }

  // updatePlayerByIdAndLogin
  public async update(item: IPlayer): Promise<IPlayer | undefined> {
    const { id, login } = item;

    const list = await this.knex<IPlayer>(appConfig.collectionName)
      .update({ login })
      .where({ id })
      .returning('*');

    return list[0];
  }

  // removePlayerById
  public async remove(id: string): Promise<undefined> {
    if (!id) {
      return;
    }

    await this.knex<IPlayer>(appConfig.collectionName)
      .delete()
      .where({ id });
  }
}

const Persistence = new Postgres();

export default Persistence;
