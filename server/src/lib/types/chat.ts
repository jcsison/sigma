export interface ChatData {
  userInput: string;
}

export interface TextGenerationHistory {
  internal: string[][];
  visible: string[][];
}

export interface TextGenerationUserData {
  character: string;
  history: TextGenerationHistory | undefined;
  max_new_tokens: number;
  mode: string;
  user_input: string;
  your_name: string;
}

export interface TextGenerationResults {
  history: TextGenerationHistory;
}

export interface TextGenerationChatData {
  results: TextGenerationResults[];
}

export interface TextGenerationResponseData {
  history: string[][];
  response: string;
}

export interface History {
  history: TextGenerationHistory;
  lastMessage: number;
}
