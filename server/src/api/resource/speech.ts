import { Request, Response } from 'express';

import { ChatData } from '../../lib/types/index.js';
import { Log, g } from '../../lib/utils/helpers/index.js';
import { textToSpeech } from '../../speech/index.js';

export const speech = async (req: Request, res: Response) => {
  const userInput = g.validate<ChatData>(
    req.body,
    g.object(['userInput', g.string])
  )?.userInput;

  if (!userInput) {
    Log.error('Invalid user input');
    res.sendStatus(500);
    return;
  }

  await textToSpeech(userInput);

  res.status(200).send(userInput);
};
