import type { TextGenerationHistory } from 'root/lib/types';
import { Log } from 'root/lib/helpers';
import { queryLLM } from '../llm';

export const summarizeHistory = async (history: TextGenerationHistory) => {
  const summarizePrompt = `Create a summary of the current conversation between us.`;

  try {
    const { chatOutput } = await queryLLM({
      characterName: 'summarizer_default',
      history,
      maxTokens: 250,
      prompt: summarizePrompt,
    });

    Log.info('Chat summary: ' + chatOutput);

    return chatOutput;
  } catch (e) {
    Log.error(e);
  }
};
