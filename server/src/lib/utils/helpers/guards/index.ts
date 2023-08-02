import {
  arrayGuard,
  booleanGuard,
  enumGuard,
  functionGuard,
  keyGuard,
  nonNullableGuard,
  numberGuard,
  objectGuard,
  promiseGuard,
  propertiesGuard,
  recordGuard,
  stringGuard
} from './guards.js';
import { validateData } from './helpers.js';

export * from './guards.js';
export * from './helpers.js';

export const g = {
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
  validate: validateData
} as const;
