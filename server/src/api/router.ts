import cors from 'cors';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { z } from 'zod';

import { Log, g } from '@root/lib/helpers';
import { chat, empty, speech } from './resource';
import { publicProcedure, router } from './trpc';

const port = g.validate(Number(process.env.PORT), g.number) ?? 3000;

const appRouter = router({
  empty: publicProcedure.query(() => empty()),
  chat: publicProcedure
    .input(z.object({ userInput: z.string() }))
    .mutation(({ input }) => chat(input)),
  speech: publicProcedure
    .input(z.object({ userInput: z.string() }))
    .query(({ input }) => speech(input)),
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  middleware: cors(),
  router: appRouter,
});

export const launchAPI = () => {
  server.listen(port);

  Log.info(`Listening on port ${port}`);
};
