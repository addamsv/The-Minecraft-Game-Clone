// import { IS_PROD } from '../../conf';

import { Response } from 'express';

const Ret = {
  err500: (res: Response, data: string) => {
    // if (!IS_PROD) {
    //   console.log(data);
    // }

    if (!res) {
      console.log('_res is not Defined');
      throw new Error('_res is not Defined');
    }

    res.status(500);

    return res.json({
      isSuccess: false,
      statusCode: 500,
      message: 'Server Side Error',
      data,
    });
  },

  err403: (res: Response, unit: string) => {
    res.status(403);

    return res.json({
      isSuccess: false,
      statusCode: 403,
      message: `${unit} not allowed`,
    });
  },

  err404: (res: Response, unit: string) => {
    res.status(404);

    return res.json({
      isSuccess: false,
      statusCode: 404,
      message: `${unit} not found`,
    });
  },

  err401: (res: Response, message?: string) => {
    res.status(401);

    res.set({ 'www-authenticate': 'Basic realm="Realm"' });

    return res.json({
      isSuccess: false,
      statusCode: 401,
      message: message || 'Unauthorized',
    });
  },

  CustomReturnData: (res: Response, message: string, data: any) => res!.json({
    isSuccess: true,
    statusCode: 200,
    message,
    data,
  }),

  Standard: (res, data) => res!.json({
    isSuccess: true,
    statusCode: 200,
    ...data,
  }),
};

export default Ret;
