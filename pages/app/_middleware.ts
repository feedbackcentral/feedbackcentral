import { withMiddlewareAuthRequired } from "@supabase/supabase-auth-helpers/nextjs";

export const middleware = withMiddlewareAuthRequired({
  redirectTo: "/auth/login",
});

// export const middleware = () => {};
