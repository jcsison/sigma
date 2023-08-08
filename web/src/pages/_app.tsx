import 'regenerator-runtime/runtime'
import { QueryClient, QueryClientProvider } from "react-query";
import { type AppType } from "next/dist/shared/lib/utils";

import "~/styles/globals.css";

const queryClient = new QueryClient();

const App: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
};

export default App;
