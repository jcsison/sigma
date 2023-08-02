import { Guard } from './guards.js';

export type AnyToUnknown<T> = {
  [Key in keyof T]: T[Key] extends IsAny<T[Key]> ? unknown : T[Key];
};
export type IsAny<T> = unknown extends T
  ? [keyof T] extends [never]
    ? never
    : T
  : never;

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
  options?: ParseJSONOptions
) => {
  try {
    if (!text) {
      return undefined;
    }

    const result = JSON.parse(text);

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
