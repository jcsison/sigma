import type { ChatData } from ':root/lib/types';
import { textToSpeech } from '~/speech';

export const speech = async ({ userInput }: ChatData) => {
  if (!userInput) {
    throw new Error('Invalid user input');
  }

  await textToSpeech(userInput);

  return userInput;
};
