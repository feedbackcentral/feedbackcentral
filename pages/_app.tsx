import type { AppProps } from "next/app";
import { UserProvider } from "@supabase/supabase-auth-helpers/react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import "windi.css";
import "../styles/reset.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <Component {...pageProps} />
    </UserProvider>
  );
};

export default MyApp;
