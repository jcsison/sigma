import { TRPCError } from '@trpc/server';

import { ChatData } from '../../lib/types/index.js';
import { textToSpeech } from '../../speech/index.js';

export const speech = async ({ userInput }: ChatData) => {
  if (!userInput) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid user input' });
  }

  await textToSpeech(userInput);

  return userInput;
};
