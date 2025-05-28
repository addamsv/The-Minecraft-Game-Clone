import Persistence from '../../model/postgreModel';

const getPlayersScore = async () => {
  try {
    const list = await Persistence.score();

    return list;
  } catch (e: unknown) {
    throw new Error(`err: with DB ${e instanceof Error ? e.message : ''}`);
  }
};

export default getPlayersScore;
