import { Request, Response } from 'express';

import { Log } from '../../lib/utils/helpers/index.js';

export const empty = (_req: Request, res: Response) => {
  Log.info('Received ping');
  res.sendStatus(200);
};
