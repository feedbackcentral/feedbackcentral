import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import {daily} from 'https://deno.land/x/deno_cron/cron.ts';

// TODO add cron jobs here!
daily(() => {
  console.log("Cron demo from Supabase edge functions!")
});

serve(async (req) => {
  return new Response(
    JSON.stringify({
      status: "down",
      message: "Ingest service not active."
    }),
    { headers: { "Content-Type": "application/json" } },
  )
})
