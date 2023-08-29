/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Guard } from './types';
import { validateData } from './helper';

type Property<T extends { [Key in keyof T]: U }, U = unknown> =
  | keyof T
  | readonly [keyof T, Guard<T[keyof T]>]
  | readonly [string, Guard<U>];
export type Properties<T extends { [Key in keyof T]: U }, U = unknown> =
  | readonly [Property<T, U>, ...Array<Property<T, U>>]
  | readonly [];

function anyGuard(): Guard<any> {
  return (o: unknown): o is any => true;
}

function arrayGuard<T>(guard?: Guard<T>): Guard<T[]> {
  return (o: unknown): o is T[] =>
    !!guard ? Array.isArray(o) && o.every(guard) : Array.isArray(o);
}

function booleanGuard(): Guard<boolean> {
  return (o: unknown): o is boolean => typeof o === 'boolean';
}

function enumGuard<T>(en: Record<string, T>): Guard<T> {
  return (o: unknown): o is T => Object.values(en).includes(o as T);
}

function functionGuard<T extends Function = Function>(): Guard<T> {
  return (o: unknown): o is T => {
    return typeof o === 'function';
  };
}

function keyGuard(): Guard<keyof any> {
  return (o: unknown): o is keyof any => {
    return stringGuard()(o) || numberGuard()(o) || symbolGuard()(o);
  };
}

function nonNullableGuard<T>(): Guard<NonNullable<T>> {
  return (o: unknown): o is NonNullable<T> => o !== undefined && o !== null;
}

function numberGuard(): Guard<number> {
  return (o: unknown): o is number => {
    return typeof o === 'number';
  };
}

function objectGuard<T>(properties?: {
  [x in keyof T]: Guard<T[x]>;
}): Guard<T> {
  if (!properties) {
    return (o: unknown): o is T => typeof o === 'object' && !Array.isArray(o);
  }

  return (o: unknown): o is T =>
    typeof o === 'object' &&
    !Array.isArray(o) &&
    !!o &&
    propertiesGuard(properties)(o);
}

function promiseGuard<T>(): Guard<Promise<T>> {
  return (o: unknown): o is Promise<T> =>
    objectGuard({
      catch: functionGuard(),
      finally: functionGuard(),
      then: functionGuard(),
    })(o);
}

function propertiesGuard<T>(properties: {
  [x in keyof T]: Guard<T[x]>;
}): Guard<{ [Key in keyof T]: T[Key] }> {
  const propertiesArray = Object.entries(properties) as [keyof T, T[keyof T]][];
  return (o: unknown): o is { [Key in keyof T]: T[Key] } =>
    propertiesArray.every((property) => {
      if (!functionGuard<Guard<T>>()(property[1])) {
        return false;
      }

      return propertyGuard(property[0], property[1])(o);
    });
}

function propertyGuard<T extends { [Key in keyof T]: U }, U>(
  property: keyof T,
  guard?: Guard<U>,
): Guard<T> {
  return (o: unknown): o is T =>
    property in (o as T) && (guard ? guard((o as T)[property]) : true);
}

function recordGuard<T extends string, U>(
  guard: Guard<U>,
): Guard<Record<T, U>> {
  return (o: unknown): o is Record<T, U> =>
    objectGuard<T>()(o) && Object.values(o).every(guard);
}

function stringGuard(): Guard<string> {
  return (o: unknown): o is string => {
    return typeof o === 'string';
  };
}

function symbolGuard(): Guard<symbol> {
  return (o: unknown): o is symbol => {
    return typeof o === 'symbol';
  };
}

function unknownGuard(): Guard<unknown> {
  return (o: unknown): o is unknown => true;
}

export const g = {
  any: anyGuard,
  array: arrayGuard,
  boolean: booleanGuard,
  enum: enumGuard,
  function: functionGuard,
  key: keyGuard,
  nonNullable: nonNullableGuard,
  number: numberGuard,
  object: objectGuard,
  promise: promiseGuard,
  properties: propertiesGuard,
  record: recordGuard,
  string: stringGuard,
  symbol: symbolGuard,
  unknown: unknownGuard,
  validate: validateData,
} as const;
