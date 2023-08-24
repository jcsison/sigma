import pino from 'pino';
import { serializeError } from 'serialize-error';

import { DataError } from '../types';
import { g } from '.';

const logger = pino({
  base: undefined,
  browser: { serialize: true },
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
  const formattedInfo = g.string(info) ? info : JSON.stringify(info);

  if (message) {
    logger.info(formattedInfo, message, ...params);
  } else {
    logger.info(formattedInfo, ...params);
  }
};

const warn = (warn: unknown, message?: string, ...params: unknown[]) => {
  const formattedWarn = g.string(warn) ? warn : JSON.stringify(warn);

  logger.warn(formattedWarn, message, ...params);
};

export const Log = { error, info, warn };
