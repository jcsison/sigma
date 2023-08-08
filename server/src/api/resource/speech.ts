import { Request, Response } from 'express';

import { ChatData } from '../../lib/types/chat.js';
import { Log, g } from '../../lib/utils/helpers/index.js';
import { textToSpeech } from '../../lib/speech/textToSpeech.js';

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

  Log.info(`User input: ${userInput}`);

  res.status(200).send(userInput);
};
