import type { AppProps } from "next/app";
import { UserProvider } from "@supabase/supabase-auth-helpers/react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import "windi.css";
import "../styles/reset.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient()

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider supabaseClient={supabaseClient}>
        <Component {...pageProps} />
        {process.env.NODE_ENV == "development" && <ReactQueryDevtools initialIsOpen={false} position={"bottom-right"} />}
      </UserProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
