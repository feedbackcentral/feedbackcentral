import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { UserProvider } from "@supabase/supabase-auth-helpers/react";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "react-toastify/dist/ReactToastify.min.css";
import "windi.css";
import "../styles/reset.css";

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    // @ts-ignore
    <QueryClientProvider client={queryClient}>
      <UserProvider supabaseClient={supabaseClient}>
        <Toaster />
        <Component {...pageProps} />
        {process.env.NODE_ENV == "development" && (
          <ReactQueryDevtools initialIsOpen={false} position={"bottom-right"} />
        )}
      </UserProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
