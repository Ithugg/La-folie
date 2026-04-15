"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { eventSchema, ticketTierSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function createEvent(data: {
  title: string;
  description: string;
  date: string;
  endDate?: string;
  venue: string;
  address?: string;
  imageUrl?: string;
  status?: string;
  featured?: boolean;
  capacity?: number;
  ticketTiers?: {
    name: string;
    description?: string;
    price: number;
    quantity: number;
  }[];
}) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "Not authorized" };
  }

  const parsed = eventSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const slug = slugify(data.title);

  const existingSlug = await db.event.findUnique({ where: { slug } });
  const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

  const event = await db.event.create({
    data: {
      title: data.title,
      slug: finalSlug,
      description: data.description,
      date: new Date(data.date),
      endDate: data.endDate ? new Date(data.endDate) : null,
      venue: data.venue,
      address: data.address || null,
      imageUrl: data.imageUrl || null,
      status: data.status || "DRAFT",
      featured: data.featured || false,
      capacity: data.capacity || null,
    },
  });

  // Create ticket tiers if provided
  if (data.ticketTiers && data.ticketTiers.length > 0) {
    for (let i = 0; i < data.ticketTiers.length; i++) {
      const tier = data.ticketTiers[i];
      await db.ticketTier.create({
        data: {
          eventId: event.id,
          name: tier.name,
          description: tier.description || null,
          price: tier.price,
          currency: "EUR",
          quantity: tier.quantity,
          sortOrder: i,
        },
      });
    }
  }

  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: "CREATE_EVENT",
      entity: "Event",
      entityId: event.id,
      details: `Created event: ${data.title}`,
    },
  });

  return { success: true, event };
}

export async function updateEvent(
  eventId: string,
  data: {
    title?: string;
    description?: string;
    date?: string;
    endDate?: string;
    venue?: string;
    address?: string;
    imageUrl?: string;
    status?: string;
    featured?: boolean;
    capacity?: number;
  }
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "Not authorized" };
  }

  const event = await db.event.update({
    where: { id: eventId },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  });

  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE_EVENT",
      entity: "Event",
      entityId: event.id,
      details: `Updated event: ${event.title}`,
    },
  });

  return { success: true, event };
}

export async function deleteEvent(eventId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "Not authorized" };
  }

  await db.event.delete({ where: { id: eventId } });

  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: "DELETE_EVENT",
      entity: "Event",
      entityId: eventId,
    },
  });

  return { success: true };
}

export async function getPublishedEvents() {
  return db.event.findMany({
    where: { status: "PUBLISHED" },
    include: {
      ticketTiers: { orderBy: { sortOrder: "asc" } },
      _count: { select: { tickets: true } },
    },
    orderBy: { date: "asc" },
  });
}

export async function getEventBySlug(slug: string) {
  return db.event.findUnique({
    where: { slug },
    include: {
      ticketTiers: { orderBy: { sortOrder: "asc" } },
      _count: { select: { tickets: true } },
    },
  });
}

export async function getAllEvents() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return [];
  }

  return db.event.findMany({
    include: {
      ticketTiers: { orderBy: { sortOrder: "asc" } },
      _count: { select: { tickets: true, orders: true } },
    },
    orderBy: { date: "desc" },
  });
}
