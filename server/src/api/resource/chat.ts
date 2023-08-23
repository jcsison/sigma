import { TRPCError } from '@trpc/server';

import { ChatData, TextGenerationResponseData } from '../../lib/types/index.js';
import { History } from '../../history/index.js';
import { Log } from '../../lib/utils/helpers/index.js';
import { queryLLM } from '../../llm/index.js';

const history = new History();

export const chat = async ({ userInput }: ChatData) => {
  if (!userInput) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid user input' });
  }

  Log.info(`User input: ${userInput}`);

  if (userInput === '/reset') {
    history.resetHistory();
    return { history: [], response: '' };
  }

  const { chatHistory, chatOutput } = await queryLLM({
    history: history.data,
    prompt: userInput
  });

  if (!chatHistory || !chatOutput) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error fetching response from LLM'
    });
  }

  Log.info(`Bot output: ${chatOutput}`);

  history.updateHistory(chatHistory).catch(Log.error);

  const textGenerationResponseData: TextGenerationResponseData = {
    history: chatHistory.visible,
    response: chatOutput
  };

  return textGenerationResponseData;
};
