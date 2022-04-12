import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { Tweet, TwitterClient } from "../_utils/twitter.ts";
import { supabaseSecretClient } from "../_utils/supabase.ts";
import { verify_request } from "../_utils/verify_request.ts";
import { classifyMultipleTweets } from "../_utils/openai.ts";

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
  // const [verify_response, integration] = await verify_request(req);
  // if (verify_response) {
  //   return verify_response;
  // }

  const body = (await req.json()) as RequestBody;
  console.log("CALLED FUNCTION", body);

  const { userId, hashtag, search } = body.parameters;
  const tweetParams: Record<string, any> = {
    "tweet.fields": ["id", "author_id", "text"] as (keyof Tweet)[],
    max_results: 10,
  };

  if (body.last_run_at) {
    tweetParams["start_time"] = new Date(body.last_run_at).toISOString();
  }

  if (body.type === "twitter_mention") {
    if (userId) {
      const mentions = await client.getMentionsByUserId(userId, tweetParams);
      console.log(mentions);
      if (mentions.data && mentions.data.length > 0) {
        const tweetText = mentions.data.map(tweet => tweet.text);
        const classificationResponse = await classifyMultipleTweets(tweetText);

        console.log(
          `Classifications res: ${JSON.stringify(classificationResponse)}`
        );
        const aiResponse = classificationResponse.choices[0].text as string;

        const sentimentsWithNumbers = aiResponse.match(
          /(Positive)|(Negative)/g
        );

        const sentiments = sentimentsWithNumbers?.filter(
          text => text.length > 0
        );
        console.log(sentiments);

        const feedbackToInsert = mentions.data.map((tweet, i) => ({
          content: tweet.text,
          source: body.id,
          project_id: body.project_id,
          classification: sentiments?.[i].toLowerCase(),
          source_meta: { author: tweet.author_id },
        }));

        //Now we can store mentions in the database. We should also do classification here.
        const { data } = await supabaseSecretClient
          .from("feedbacks")
          .insert(feedbackToInsert)
          .throwOnError();

        console.log(`Inserted ${data?.length} feedback`);

        await supabaseSecretClient
          .from("sources")
          .update({
            last_run_at: new Date().toISOString(),
            next_run_at: new Date().toISOString(),
          })
          .match({ id: body.id })
          .throwOnError();
      } else {
        console.log("No new mentions found");
      }
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
  id: string;
  type: "twitter_mention" | "twitter_hashtag" | "twitter_search";
  parameters: TwitterMetadata;
  last_run: string;
  user_id: string;
  project_id: string;
  last_run_at: string;
  next_run_at: string;
}
