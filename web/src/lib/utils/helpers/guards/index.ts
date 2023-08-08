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
  stringGuard,
} from "./guards";
import { validateData } from "./helpers";

export * from "./guards";
export * from "./helpers";

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
  validate: validateData,
} as const;
