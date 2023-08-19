export type ResponseData = unknown;

export interface ChatData {
  userInput: string;
}

export interface TextGenerationResponseData {
  history: string[][];
  response: string;
}
