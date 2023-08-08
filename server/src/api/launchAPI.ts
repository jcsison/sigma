import express from 'express';
import cors from 'cors';

import { Log } from '../lib/utils/helpers/index.js';
import { chat, empty, speech } from './resource/index.js';

const port = process.env.PORT ?? 3000;

export const app = express();
export const router = express.Router();

const loadRoutes = () => {
  router.get('/', empty);
  router.post('/chat', chat);
  router.post('/speech', speech);
};

export const launchAPI = () => {
  app.use(cors());

  loadRoutes();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api', router);
  app.listen(port);

  Log.info(`Listening on port ${port}`);
};
