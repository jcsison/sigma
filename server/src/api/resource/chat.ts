import axios from 'axios';
import { Request, Response } from 'express';

import { Log, g } from '../../lib/utils/helpers/index.js';

interface ChatData {
  userInput: string;
}

interface TextGenerationUserData {
  character: string;
  max_new_tokens: number;
  mode: string;
  user_input: string;
  your_name: string;
}

interface TextGenerationHistory {
  internal: string[][];
  visible: string[][];
}

interface TextGenerationResults {
  history: TextGenerationHistory;
}

interface TextGenerationChatData {
  results: TextGenerationResults[];
}

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

  const textGenerationAPIHost = g.validate(
    process.env.TEXT_GENERATION_API_HOST,
    g.string
  );

  if (!textGenerationAPIHost) {
    Log.error('Missing `text-generation-webui` API Host');
    res.sendStatus(500);
    return;
  }

  const characterName = g.validate(process.env.CHARACTER_NAME, g.string);

  if (!characterName) {
    Log.error('Missing character name');
    res.sendStatus(500);
    return;
  }

  const userName = g.validate(process.env.USER_NAME, g.string);

  if (!userName) {
    Log.error('Missing user name');
    res.sendStatus(500);
    return;
  }

  const textGenerationUserData: TextGenerationUserData = {
    character: characterName,
    max_new_tokens: 250,
    mode: 'chat',
    user_input: userInput,
    your_name: userName
  };

  try {
    const textGenerationResponse = await axios.post(
      `${textGenerationAPIHost}/v1/chat`,
      textGenerationUserData
    );

    const chatData = g.validate<TextGenerationChatData>(
      textGenerationResponse.data,
      g.object([
        'results',
        g.array(
          g.object([
            'history',
            g.object(
              ['internal', g.array(g.array(g.string))],
              ['visible', g.array(g.array(g.string))]
            )
          ])
        )
      ])
    );

    if (!chatData) {
      Log.error('Error parsing chat data');
      res.sendStatus(500);
      return;
    }

    Log.info(`Chat output: ${chatData.results[0]?.history.visible[0]?.[1]}`);

    // TODO: implement speech sdk

    res.status(200).send(chatData.results[0]?.history.visible[0]?.[1]);
  } catch (e) {
    Log.error(e, 'Error fetching chat data');
    res.sendStatus(500);
    return;
  }
};
