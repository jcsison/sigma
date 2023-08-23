import { createTRPCNext } from "@trpc/next";
import { httpBatchLink } from "@trpc/client";

import { env } from "~/env.mjs";
import { type AppRouter } from "server/api";

export const trpc = createTRPCNext<AppRouter>({
  config(_opts) {
    return {
      links: [
        httpBatchLink({
          url: env.NEXT_PUBLIC_SERVER_API_URL,
        }),
      ],
    };
  },
});
