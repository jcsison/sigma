import "regenerator-runtime/runtime";
import { type AppType } from "next/dist/shared/lib/utils";

import "~/styles/globals.css";
import { trpc } from "~/lib/api/trpc";

const App: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default trpc.withTRPC(App);
