import type { Guard } from './types';

type ParseJSONOptions =
  | {
      ignoreError?: never;
      throwError: true;
    }
  | {
      ignoreError: boolean;
      throwError?: false;
    };

export const parseJSON = <T>(
  text: string | undefined,
  guard: Guard<T>,
  options?: ParseJSONOptions,
) => {
  try {
    if (!text) {
      return undefined;
    }

    const result = JSON.parse(text) as unknown;

    if (guard(result as T)) {
      return result as T;
    } else {
      throw new Error('Error parsing JSON');
    }
  } catch (error) {
    if (options?.throwError) {
      throw error;
    } else if (!options?.ignoreError) {
      console.error(error, text);
    }
  }

  return undefined;
};

export const validateData = <T>(o: unknown, guard: Guard<T>) =>
  guard(o as T) ? (o as T) : undefined;
