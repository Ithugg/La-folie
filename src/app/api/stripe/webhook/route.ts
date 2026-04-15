import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { fulfillOrder } from "@/actions/tickets";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        await fulfillOrder(orderId);
      } catch (err) {
        console.error("Error fulfilling order:", err);
        return NextResponse.json(
          { error: "Error fulfilling order" },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
