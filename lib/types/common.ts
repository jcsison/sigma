export class DataError extends Error {
  data: unknown = undefined;

  constructor(message: string, data: unknown) {
    super(message);
    this.data = data;
  }
}

export type AnyToUnknown<T> = {
  [Key in keyof T]: T[Key] extends IsAny<T[Key]> ? unknown : T[Key];
};

export type EnumType<T> = ObjectValues<T>;

export type IsAny<T> = unknown extends T
  ? [keyof T] extends [never]
    ? never
    : T
  : never;

export type Maybe<T> = T | undefined | null;

export type ObjectValues<T> = T[keyof T];
