import * as dotenv from 'dotenv';

import { launchAPI } from './api/launchAPI.js';

dotenv.config();

const start = () => {
  launchAPI();
};

start();
