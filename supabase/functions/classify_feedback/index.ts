import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^1.33.2'
import { Configuration, OpenAIApi } from "https://esm.sh/openai@2.0.5";

const openai = new OpenAIApi(new Configuration({
  organization: Deno.env.get('OPENAI_ORGANIZATION'),
  apiKey: Deno.env.get('OPENAI_API_KEY')
}))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

const supabaseSecret = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const respond = (status: number, body: any): Response => {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: { "Content-Type": "application/json" },
    },
  );
};

type Classification = "positive" | "negative" | "neutral"

type Feedback = {
  id: string,
  content: string,
  classification?: Classification,
  classification_completion_id?: string
};

serve(async (req) => {
  supabase.auth.setAuth(req.headers.get('Authorization')!.split('Bearer ')[1])

  const feedback_id = req.headers.get("x-feedback-id");
  if (!feedback_id) {
    return respond(400, {
      status: "ok",
      message:
        "Invalid request: missing a required header; please read the docs.",
    });
  }
  const feedback = await supabase.from<Feedback>("feedback").select("id, content, classification, classification_completion_id").eq("id", feedback_id).single();
  if(feedback.status != 200) {
    if(feedback.status >= 500) {
      return respond(feedback.status, {
        status: "down",
        message:
          "Internal Server Error: failed to fetch feedback",
      });
    }

    return respond(feedback.status, {
      status: "ok",
      message:
        "Error: failed to fetch feedback",
    });
  }

  if (!feedback.body?.content) {
    return respond(400, {
      status: "down",
      message:
        "Bad Request: Missing feedback content",
    });
  }

  const response = await openai.createClassification({
    search_model: "curie",
    model: "curie",
    examples: [
      ["Thank you for the goodies.", "Positive"],
      ["It is a disgrace", "Negative"],
      ["Effortlessly create Edge functions for your next @supabase based web/mobile project, and deploy on @deno_land's Edge platform. Supabase just rolled out one of the most sought-after feature⚡💪", "Positive"]
    ],
    query: feedback.body.content,
    labels: ["positive", "negative", "neutral"],
  });

  if((!(response.status >= 200 && response.status < 300)) || !response.data) {
    return respond(500, {
      status: "down",
      message:
        "OpenAI Error: Failed to fetch classification",
    });
  }

  const { completion, label } = response.data;

  if(!completion || !label) {
    return respond(500, {
      status: "down",
      message:
        "OpenAI Error: Missing required data!",
    });
  }
  
  await supabaseSecret.from<Feedback>("feedback").update({
    classification: label as Classification,
    classification_completion_id: completion
  })

  return respond(200, {
    status: "up",
    message: "Successfully classified and stored result.",
    data: {
      classification: label,
      completion_id: completion,
      completion: {
        ...response.data,
        selected_examples: null
      }
    }
  })
})

