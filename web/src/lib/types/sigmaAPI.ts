export type ResponseData = unknown;

export interface TextGenerationResponseData {
  history: string[][];
  response: string;
}

export interface UserInput {
  userInput: string;
}
