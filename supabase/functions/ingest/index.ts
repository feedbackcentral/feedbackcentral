import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { Tweet, TwitterClient } from "../_utils/twitter.ts";

const client = new TwitterClient(
  "AAAAAAAAAAAAAAAAAAAAACDzawEAAAAA2BcTEqB5qI%2Ftbbx7%2BxHXg0Qm5qU%3DNwZ0O6SMgT3pSsw0nygaPtwwdiz6Lzkxpsg8I6LTYviMzrJwOJ"
);

serve(async (req: Request) => {
  const body = (await req.json()) as RequestBody;

  const { userId, hashtag, search } = body.integration_metadata;

  if (body.integration_type === "twitter") {
    const tweetParams = {
      "tweet.fields": ["id", "author_id", "text"] as (keyof Tweet)[],
    };

    if (userId) {
      const mentions = await client.getMentionsByUserId(userId, tweetParams);
    }
  }

  return new Response(JSON.stringify({}), {
    headers: { "Content-Type": "application/json" },
  });
});

type TwitterMetadata = {
  userId?: string;
  hashtag?: string;
  search?: string;
};

interface RequestBody {
  integration_type: "twitter";
  integration_metadata: TwitterMetadata;
  last_run: string;
  user_id: string;
}
