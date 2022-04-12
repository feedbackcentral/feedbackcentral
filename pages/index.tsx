import { useUser } from "@supabase/supabase-auth-helpers/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
  const { isLoading, user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    } else if (!isLoading && user) {
      router.push("/app");
    }
  }, [isLoading, router, user]);
  return (
    <div>
      {/* TODO Add landing page */}
      <h1>Feedback Central</h1>
    </div>
  );
};

export default Home;
