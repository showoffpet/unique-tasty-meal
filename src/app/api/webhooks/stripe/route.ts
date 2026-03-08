import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { serverEnv } from "@/lib/env";

const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY, {
  apiVersion: "2026-02-25.clover",
});

const webhookSecret = serverEnv.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) {
      throw new Error("Missing stripe-signature or webhook secret");
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    );
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      // TODO: Process successful payment (update order status, send confirmation, etc.)
      break;
    }
    // ... handle other event types
    default:
      // Unhandled event type — no action needed
  }

  return NextResponse.json({ received: true });
}
