import { TRPCError } from '@trpc/server';

import type { ChatData } from '@root/lib/types';
import { textToSpeech } from '~/speech';

export const speech = async ({ userInput }: ChatData) => {
  if (!userInput) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid user input' });
  }

  await textToSpeech(userInput);

  return userInput;
};
