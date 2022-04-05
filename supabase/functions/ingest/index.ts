import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

const usernameEndpoint =
  "https://api.twitter.com/2/users/by?usernames=supabase";

serve(async () => {
  console.log("Getting from twitter");

  const usernameRes = await fetch(usernameEndpoint, {
    headers: {
      "Authorization":
        "Bearer AAAAAAAAAAAAAAAAAAAAACDzawEAAAAA2BcTEqB5qI%2Ftbbx7%2BxHXg0Qm5qU%3DNwZ0O6SMgT3pSsw0nygaPtwwdiz6Lzkxpsg8I6LTYviMzrJwOJ",
    },
  });

  const userId = (await usernameRes.json()).data[0].id;

  const mentionsRes = await fetch(
    `https://api.twitter.com/2/users/${userId}/mentions?tweet.fields=created_at,text,author_id`,
    {
      headers: {
        "Authorization":
          "Bearer AAAAAAAAAAAAAAAAAAAAACDzawEAAAAA2BcTEqB5qI%2Ftbbx7%2BxHXg0Qm5qU%3DNwZ0O6SMgT3pSsw0nygaPtwwdiz6Lzkxpsg8I6LTYviMzrJwOJ",
      },
    },
  );
  console.log(await mentionsRes.json());

  return new Response(
    JSON.stringify({
      status: "down",
      message: "Ingest service not active.",
    }),
    { headers: { "Content-Type": "application/json" } },
  );
});
