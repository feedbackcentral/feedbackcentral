import sodium from "https://deno.land/x/sodium@0.2.0/basic.ts";
import { supabaseClient } from "./supabase.ts";

type Integration = {
  id: string;
  public_key: string;
};

const respond = (status: number, body: any): Response => {
    return new Response(
      JSON.stringify(body),
      {
        status,
        headers: { "Content-Type": "application/json" },
      },
    );
  };

export const verify_request = async (
  req: Request,
): Promise<[Response | null, Integration | null]> => {
  const signature = req.headers.get("x-signature");
  const timestamp = req.headers.get("x-timestamp");
  const integration_id = req.headers.get("x-integration");
  const raw_body = await req.text();

  if (!signature || !timestamp || !integration_id || !raw_body) {
    return [
      respond(400, {
        status: "ok",
        message:
          "Invalid request: missing a required param; please read the docs.",
      }),
      null,
    ];
  }

  await sodium.ready;

  const integration = await supabaseClient.from<Integration>("integrations").select(
    "public_key",
  ).eq("id", integration_id).single();

  if (integration.status != 200) {
    if (integration.status >= 500) {
      return [
        respond(integration.status, {
          status: "down",
          message:
            "Internal Server Error: failed to fetch integration public key",
        }),
        null,
      ];
    }

    return [
      respond(integration.status, {
        status: "ok",
        message: "Error: failed to fetch integration public key",
      }),
      null,
    ];
  }

  const message = `${timestamp}${integration_id}${raw_body}`;
  const isVerified = sodium.crypto_sign_verify_detached(
    Buffer.from(signature, "hex"),
    message,
    Buffer.from(integration.body?.public_key ?? ""),
  );
  if (!isVerified) {
    return [
      respond(401, {
        status: "ok",
        message: "Invalid Request: Invalid signature",
      }),
      null,
    ];
  }

  return [null, integration.body];
};
