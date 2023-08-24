import { TRPCError } from '@trpc/server';

import type { ChatData, TextGenerationResponseData } from '@root/lib/types';
import { History } from '~/history';
import { Log } from '@root/lib/helpers';
import { queryLLM } from '~/llm';

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
    prompt: userInput,
  });

  if (!chatHistory || !chatOutput) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error fetching response from LLM',
    });
  }

  Log.info(`Bot output: ${chatOutput}`);

  history.updateHistory(chatHistory).catch(Log.error);

  const textGenerationResponseData: TextGenerationResponseData = {
    history: chatHistory.visible,
    response: chatOutput,
  };

  return textGenerationResponseData;
};
