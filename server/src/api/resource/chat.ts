import { Request, Response } from 'express';

import { ChatData, TextGenerationResponseData } from '../../lib/types/index.js';
import { History } from '../../history/index.js';
import { Log, g } from '../../lib/utils/helpers/index.js';
import { queryLLM } from '../../llm/index.js';

const history = new History();

export const chat = async (req: Request, res: Response) => {
  const userInput = g.validate<ChatData>(
    req.body,
    g.object(['userInput', g.string])
  )?.userInput;

  if (!userInput) {
    Log.error('Invalid user input');
    res.sendStatus(500);
    return;
  }

  Log.info(`User input: ${userInput}`);

  if (userInput === '/reset') {
    history.resetHistory();
    res.status(200).send({ history: [], response: '' });
    return;
  }

  try {
    const { chatHistory, chatOutput } = await queryLLM({
      history: history.data,
      prompt: userInput
    });

    if (!chatHistory || !chatOutput) {
      res.status(500);
      return;
    }

    Log.info(`Bot output: ${chatOutput}`);

    history.updateHistory(chatHistory).catch(Log.error);

    const textGenerationResponseData: TextGenerationResponseData = {
      history: chatHistory.visible,
      response: chatOutput
    };

    res.status(200).send(textGenerationResponseData);
  } catch (e) {
    Log.error(e, 'Error fetching chat data');
    res.sendStatus(500);
    return;
  }
};
