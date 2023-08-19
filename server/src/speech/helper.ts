import fs from 'fs';

export const xmlToString = (path: string) => {
  const xml = fs.readFileSync(path, 'utf8') ?? '';
  return xml;
};
