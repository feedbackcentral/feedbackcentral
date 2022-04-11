// import { Configuration, OpenAIApi } from "https://esm.sh/openai@2.0.5";

// export const openai = new OpenAIApi(
//   new Configuration({
//     apiKey: Deno.env.get("OPENAI_API_KEY"),
//   })
// );

export async function classifyMultipleTweets(tweetTexts: string[]) {
  const prompt = `Classify the sentiment in these tweets\n${tweetTexts
    .map((t, i) => `${i + 1}. ${t}`)
    .join("\n")}\nTweet sentiment ratings:`;

  console.log(`OpenAI prompt ${prompt}`);

  const response = await fetch(
    `https://api.openai.com/v1/engines/text-davinci-002/completions`,
    {
      body: JSON.stringify({
        prompt,
        temperature: 0,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      }),
      headers: {
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    }
  );
  return await response.json();
}
