import { Configuration, OpenAIApi } from "https://esm.sh/openai@2.0.5";

export const openai = new OpenAIApi(
  new Configuration({
    organization: Deno.env.get("OPENAI_ORGANIZATION"),
    apiKey: Deno.env.get("OPENAI_API_KEY"),
  }),
);
