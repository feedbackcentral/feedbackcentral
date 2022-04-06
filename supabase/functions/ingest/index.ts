import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { Tweet, TwitterClient } from "../_utils/twitter.ts";

const bearerToken = Deno.env.get("TWITTER_BEARER_TOKEN");
if (!bearerToken) {
  throw new Error("TWITTER_BEARER_TOKEN is not set");
}
const client = new TwitterClient(bearerToken);

/**
 * Takes information about a source that is ready to be ingested from, then
 * 1. Ingests feedback accordingly to the source type.
 *  a. If the source is a Twitter account, it will ingest all of the tweets where this account is mentioned.
 *  b. If the source is a Twitter hashtag, it will ingest all of the tweets where this hashtag is mentioned.
 *  c. If the source is a Twitter search, it will ingest all of the tweets that match the search query.
 * 2. Saves feedback to the database.
 * 3. Updates the source's last_run to now, and next_ingest_at field to the next time the source should be ingested.
 */
serve(async (req: Request) => {
  const body = (await req.json()) as RequestBody;

  const { userId, hashtag, search } = body.integrationMetadata;
  const tweetParams = {
    "tweet.fields": ["id", "author_id", "text"] as (keyof Tweet)[],
  };

  if (body.integrationType === "twitter_account") {
    if (userId) {
      const mentions = await client.getMentionsByUserId(userId, tweetParams);

      //Now we can store mentions in the database. We should also do classification here.
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
  integrationType: "twitter_account" | "twitter_hashtag" | "twitter_search";
  integrationMetadata: TwitterMetadata;
  last_run: string;
  user_id: string;
}
