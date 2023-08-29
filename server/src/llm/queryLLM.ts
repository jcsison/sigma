import axios from 'axios';

import type {
  TextGenerationChatData,
  TextGenerationHistory,
  TextGenerationUserData,
} from '@root/lib/types';
import { env } from '~/env.mjs';
import { g } from '@root/lib/helpers';

interface QueryLLMParams {
  characterName?: string;
  history?: TextGenerationHistory;
  maxTokens?: number;
  prompt: string;
  userName?: string;
}

export const queryLLM = async ({
  characterName,
  history,
  maxTokens,
  prompt,
  userName,
}: QueryLLMParams) => {
  const textGenerationAPIHost = env.TEXT_GENERATION_API_HOST;

  const defaultCharacterName = env.CHARACTER_NAME;
  const defaultUserName = env.USER_NAME;

  const textGenerationUserData: TextGenerationUserData = {
    character: characterName ?? defaultCharacterName,
    history,
    max_new_tokens: maxTokens ?? 75,
    mode: 'chat',
    user_input: prompt,
    your_name: userName ?? defaultUserName,
  };

  const textGenerationResponse = await axios.post(
    `${textGenerationAPIHost}/v1/chat`,
    textGenerationUserData,
  );

  const chatData = g.validate<TextGenerationChatData>(
    textGenerationResponse.data,
    g.object({
      results: g.array(
        g.object({
          history: g.object({
            internal: g.array(g.array(g.string())),
            visible: g.array(g.array(g.string())),
          }),
        }),
      ),
    }),
  );

  if (!chatData) {
    throw new Error('Error parsing chat data');
  }

  const chatHistory = chatData.results[0]?.history;
  const chatOutput = chatHistory?.visible[chatHistory.visible.length - 1]?.[1];

  return { chatHistory, chatOutput } as const;
};
