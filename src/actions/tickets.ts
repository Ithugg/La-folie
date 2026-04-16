"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { generateTicketToken } from "@/lib/tickets";

export async function createCheckoutSession(
  eventId: string,
  tierId: string,
  quantity: number = 1
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const tier = await db.ticketTier.findUnique({
    where: { id: tierId },
    include: { event: true },
  });

  if (!tier) return { error: "Ticket tier not found" };
  if (tier.sold + quantity > tier.quantity) return { error: "Not enough tickets available" };

  const order = await db.order.create({
    data: {
      userId: session.user.id,
      eventId,
      totalAmount: tier.price * quantity,
      currency: tier.currency,
      status: "PENDING",
    },
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: tier.currency.toLowerCase(),
          product_data: {
            name: `${tier.event.title} - ${tier.name}`,
            description: tier.description || undefined,
          },
          unit_amount: tier.price,
        },
        quantity,
      },
    ],
    metadata: {
      orderId: order.id,
      eventId,
      tierId,
      userId: session.user.id,
      quantity: quantity.toString(),
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tickets/${order.id}?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/calendar/${tier.event.slug}?cancelled=true`,
  });

  await db.order.update({
    where: { id: order.id },
    data: { stripeSessionId: checkoutSession.id },
  });

  return { url: checkoutSession.url };
}

export async function getUserTickets() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return db.ticket.findMany({
    where: { userId: session.user.id },
    include: {
      event: true,
      ticketTier: true,
      order: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTicketById(ticketId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  return db.ticket.findFirst({
    where: {
      id: ticketId,
      userId: session.user.id,
    },
    include: {
      event: true,
      ticketTier: true,
      order: true,
    },
  });
}

export async function getOrderById(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  return db.order.findFirst({
    where: {
      id: orderId,
      userId: session.user.id,
    },
    include: {
      event: true,
      tickets: {
        include: { ticketTier: true },
      },
    },
  });
}

export async function fulfillOrder(orderId: string) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { tickets: true },
  });

  if (!order) throw new Error("Order not found");
  if (order.tickets.length > 0) return; // Already fulfilled

  const metadata = await stripe.checkout.sessions.retrieve(
    order.stripeSessionId!
  );

  const quantity = parseInt(metadata.metadata?.quantity || "1");
  const tierId = metadata.metadata?.tierId;

  if (!tierId) throw new Error("Missing tier ID");

  // Create tickets
  for (let i = 0; i < quantity; i++) {
    await db.ticket.create({
      data: {
        token: generateTicketToken(),
        userId: order.userId,
        eventId: order.eventId,
        orderId: order.id,
        ticketTierId: tierId,
        status: "VALID",
      },
    });
  }

  // Update tier sold count
  await db.ticketTier.update({
    where: { id: tierId },
    data: { sold: { increment: quantity } },
  });

  // Update order status
  await db.order.update({
    where: { id: orderId },
    data: { status: "PAID" },
  });
}
