import { createTRPCNext } from "@trpc/next";
import { httpBatchLink } from "@trpc/client";

import type { AppRouter } from "server/api";
import { env } from "~/env.mjs";

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
