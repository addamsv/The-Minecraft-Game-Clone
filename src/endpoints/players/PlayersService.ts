import { Response } from 'express';
import Ret from '../../model/Ret';
import getPlayersScore from './PlayersRepository';

const getScoreList = async (res: Response) => {
  try {
    const list = await getPlayersScore();

    return Ret.Standard(res, {
      statusCode: 200,
      message: 'Score List',
      data: list,
    });
  } catch (e: unknown) {
    return Ret.err500(res, `err: Login ${e instanceof Error ? e.message : ''}`);
  }
};

export default getScoreList;
