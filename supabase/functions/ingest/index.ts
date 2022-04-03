import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

serve(async (req) => {
  return new Response(
    JSON.stringify({
      status: "down",
      message: "Ingest service not active."
    }),
    { headers: { "Content-Type": "application/json" } },
  )
})