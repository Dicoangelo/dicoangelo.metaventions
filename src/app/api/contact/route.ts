import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { contactRateLimit, createRateLimitHeaders, getClientIdentifier } from "@/lib/ratelimit";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100, "Name must be 100 characters or fewer."),
  email: z.string().trim().max(254).email("Please enter a valid email address."),
  message: z.string().trim().min(10, "Message must be at least 10 characters.").max(5000, "Message must be 5,000 characters or fewer."),
});
const MAX_BODY_BYTES = 32_768;
const DELIVERY_ERROR = "Your message could not be sent. Please try again or email Dico directly.";

export async function POST(req: NextRequest) {
  const rate = await contactRateLimit.limit(`contact:${getClientIdentifier(req.headers)}`);
  const responseHeaders = {
    ...createRateLimitHeaders(rate.limit, rate.remaining, rate.reset),
    "Cache-Control": "no-store",
  };
  if (!rate.success) {
    return NextResponse.json(
      { error: "Too many messages. Please wait a minute before trying again." },
      { status: 429, headers: { ...responseHeaders, "Retry-After": String(Math.max(1, Math.ceil((rate.reset - Date.now()) / 1000))) } }
    );
  }

  if (Number(req.headers.get("content-length")) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Message is too large." }, { status: 413, headers: responseHeaders });
  }

  let input: unknown;
  try {
    const body = await req.text();
    if (new TextEncoder().encode(body).length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Message is too large." }, { status: 413, headers: responseHeaders });
    }
    input = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400, headers: responseHeaders });
  }

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Please check the form and try again." },
      { status: 400, headers: responseHeaders }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  // Require an explicitly configured, verified sender; never impersonate the visitor.
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim() || "dico.angelo97@gmail.com";
  if (!apiKey || !from) {
    console.error("Contact email delivery is not configured.");
    return NextResponse.json({ error: DELIVERY_ERROR }, { status: 503, headers: responseHeaders });
  }

  const { name, email, message } = parsed.data;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: "New message from dicoangelo.metaventionsai.com",
        // Plain text keeps visitor-provided markup inert in the recipient's inbox.
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const result: unknown = await response.json().catch(() => null);
    if (!response.ok || !result || typeof result !== "object" || !("id" in result) || typeof result.id !== "string" || !result.id.trim()) {
      // Keep provider details, credentials and visitor content out of responses/logs.
      console.error("Contact email was not accepted by Resend.", { status: response.status });
      return NextResponse.json({ error: DELIVERY_ERROR }, { status: 502, headers: responseHeaders });
    }

    // Success means the email provider accepted delivery, not just a database write.
    return NextResponse.json({ success: true }, { headers: responseHeaders });
  } catch {
    console.error("Contact email delivery request failed.");
    return NextResponse.json({ error: DELIVERY_ERROR }, { status: 502, headers: responseHeaders });
  }
}
