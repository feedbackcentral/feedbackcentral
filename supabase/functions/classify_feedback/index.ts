import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

serve(() => {
  return new Response(
    JSON.stringify({
      status: "down",
      message: "Classification service not active.",
    }),
    { headers: { "Content-Type": "application/json" } },
  );
});
