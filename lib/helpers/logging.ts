import pino from 'pino';
import { serializeError } from 'serialize-error';

import type { DataError } from 'lib/types';
import { g } from '.';

const logger = pino({
  base: undefined,
});

const error = (error: unknown, message?: string, ...params: unknown[]) => {
  if (g.object<DataError>('name', 'message', 'data')(error)) {
    logger.error(
      JSON.stringify(serializeError(error)),
      message,
      error.message,
      error.data,
      ...params,
    );
  } else if (g.object<Error>('name', 'message')(error)) {
    logger.error(error.message, message, ...params);
  } else if (g.string(error)) {
    logger.error(error, message, ...params);
  } else {
    logger.error(JSON.stringify(serializeError(error)), message, ...params);
  }
};

const info = (info: unknown, message?: string, ...params: unknown[]) => {
  if (g.string(info)) {
    logger.info(info, message, ...params);
  } else {
    logger.info(JSON.stringify(info), message, ...params);
  }
};

const warn = (warn: unknown, message?: string, ...params: unknown[]) => {
  if (g.string(warn)) {
    logger.warn(warn, message, ...params);
  } else {
    logger.warn(JSON.stringify(warn), message, ...params);
  }
};

export const Log = { error, info, warn };
