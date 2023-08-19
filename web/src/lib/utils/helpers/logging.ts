const error = (error: unknown, message?: string) => {
  if (error) {
    console.error(error, message);
  }
};

const info = (info: unknown, message?: string) => {
  if (info) {
    if (message) {
      console.log(info, message);
      return;
    }

    console.log(info);
  }
};

const warn = (warn: unknown, message?: string) => {
  if (warn) {
    console.warn(warn, message);
  }
};

export const Log = { error, info, warn };
