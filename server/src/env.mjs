import { createEnv } from '@t3-oss/env-nextjs';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    PORT: z.string(),
    TEXT_GENERATION_API_HOST: z.string(),
    AZURE_SPEECH_KEY: z.string(),
    AZURE_SPEECH_REGION: z.string(),
    CHARACTER_NAME: z.string(),
    USER_NAME: z.string(),
  },

  client: {},

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    PORT: process.env.PORT,
    TEXT_GENERATION_API_HOST: process.env.TEXT_GENERATION_API_HOST,
    AZURE_SPEECH_KEY: process.env.AZURE_SPEECH_KEY,
    AZURE_SPEECH_REGION: process.env.AZURE_SPEECH_REGION,
    CHARACTER_NAME: process.env.CHARACTER_NAME,
    USER_NAME: process.env.USER_NAME,
  },

  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
