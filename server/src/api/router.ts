import cors from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import Elysia, { t } from 'elysia';

import { g, Log } from ':root/lib/helpers';
import { env } from '~/env.mjs';

import { chat, empty, speech } from './resource';

const port = g.validate(Number(env.PORT), g.number()) ?? 3000;

const appRouter = new Elysia()
  .use(cors())
  .use(swagger())
  .get('/', () => empty())
  .post('/chat', ({ body }) => chat(body), {
    body: t.Object({ userInput: t.String() }),
  })
  .post('/speech', ({ body }) => speech(body), {
    body: t.Object({ userInput: t.String() }),
  });

export type AppRouter = typeof appRouter;

export const launchAPI = () => {
  appRouter.listen(port);

  Log.info(`Listening on port ${port}`);
};
