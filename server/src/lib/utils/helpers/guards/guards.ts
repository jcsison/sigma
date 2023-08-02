/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type Guard<T> = (o: unknown) => o is T;

type Property<T extends { [Key in keyof T]: U }, U = unknown> =
  | keyof T
  | readonly [keyof T, Guard<T[keyof T]>]
  | readonly [string, Guard<U>];
export type Properties<T extends { [Key in keyof T]: U }, U = unknown> =
  | readonly [Property<T, U>, ...Array<Property<T, U>>]
  | readonly [];

function arrayGuardF<T>(guard?: Guard<T>): Guard<T[]> {
  return (o: unknown): o is T[] =>
    !!guard ? Array.isArray(o) && o.every(guard) : Array.isArray(o);
}

function booleanGuardF(o: unknown): o is boolean {
  return typeof o === 'boolean';
}

function enumGuardF<T>(en: Record<string, T>): Guard<T> {
  return (o: unknown): o is T => Object.values(en).includes(o as T);
}

function functionGuardF(o: unknown): o is Function {
  return typeof o === 'function';
}

function keyGuardF(o: unknown): o is keyof any {
  return stringGuardF(o) || numberGuardF(o) || symbolGuardF(o);
}

function nonNullableGuardF<T>(): Guard<NonNullable<T>> {
  return (o: unknown): o is NonNullable<T> => o !== undefined && o !== null;
}

function numberGuardF(o: unknown): o is number {
  return typeof o === 'number';
}

function objectGuardF<T extends { [Key in keyof T]: T[Key] }, U = unknown>(
  ...properties: Properties<T, U>
): Guard<T & { [Key in keyof T]: U }> {
  if (!properties.length) {
    return (o: unknown): o is T => typeof o === 'object' && !Array.isArray(o);
  }

  return (o: unknown): o is T & { [Key in keyof T]: U } =>
    typeof o === 'object' &&
    !Array.isArray(o) &&
    !!o &&
    propertiesGuardF(...properties)(o);
}

function promiseGuardF<T>(): Guard<Promise<T>> {
  return (o: unknown): o is Promise<T> =>
    objectGuardF(
      ['catch', functionGuardF],
      ['finally', functionGuardF],
      ['then', functionGuardF]
    )(o);
}

function propertiesGuardF<T extends { [Key in keyof T]: U }, U>(
  ...properties: Array<Property<T, U>>
): Guard<{ [Key in keyof T]: T[Key] }> {
  return (o: unknown): o is { [Key in keyof T]: T[Key] } =>
    properties.every(property =>
      keyGuardF(property)
        ? propertyGuardF<T, U>(property)(o)
        : propertyGuardF(property[0] as keyof T, property[1])(o)
    );
}

function propertyGuardF<T extends { [Key in keyof T]: U }, U>(
  property: keyof T,
  guard?: Guard<U>
): Guard<T> {
  return (o: unknown): o is T =>
    property in (o as T) && (guard ? guard((o as T)[property]) : true);
}

function recordGuardF<T extends string, U>(
  guard: Guard<U>
): Guard<Record<T, U>> {
  return (o: unknown): o is Record<T, U> =>
    objectGuardF()(o) && Object.values(o).every(guard);
}

function stringGuardF(o: unknown): o is string {
  return typeof o === 'string';
}

function symbolGuardF(o: unknown): o is symbol {
  return typeof o === 'symbol';
}

export const arrayGuard = arrayGuardF;
export const booleanGuard: Guard<boolean> = booleanGuardF;
export const enumGuard = enumGuardF;
export const functionGuard: Guard<Function> = functionGuardF;
export const keyGuard: Guard<keyof any> = keyGuardF;
export const nonNullableGuard = nonNullableGuardF;
export const numberGuard: Guard<number> = numberGuardF;
export const objectGuard = objectGuardF;
export const propertiesGuard = propertiesGuardF;
export const promiseGuard = promiseGuardF;
export const recordGuard = recordGuardF;
export const stringGuard: Guard<string> = stringGuardF;
