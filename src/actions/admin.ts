"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Not authorized");
  }
  return session;
}

export async function getAdminStats() {
  await requireAdmin();

  const [
    totalUsers,
    totalEvents,
    totalTickets,
    totalRevenue,
    recentUsers,
    activeReferralCodes,
  ] = await Promise.all([
    db.user.count(),
    db.event.count(),
    db.ticket.count(),
    db.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: "PAID" },
    }),
    db.user.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    db.referralCode.count({ where: { isActive: true } }),
  ]);

  return {
    totalUsers,
    totalEvents,
    totalTickets,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    recentUsers,
    activeReferralCodes,
  };
}

export async function getAdminUsers() {
  await requireAdmin();

  return db.user.findMany({
    include: {
      _count: {
        select: { referralCodes: true, tickets: true, orders: true },
      },
      flags: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUserStatus(userId: string, status: string) {
  const session = await requireAdmin();

  const user = await db.user.update({
    where: { id: userId },
    data: { status },
  });

  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE_USER_STATUS",
      entity: "User",
      entityId: userId,
      details: `Changed status to ${status}`,
    },
  });

  return user;
}

export async function updateUserRole(userId: string, role: string) {
  const session = await requireAdmin();

  const user = await db.user.update({
    where: { id: userId },
    data: { role },
  });

  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE_USER_ROLE",
      entity: "User",
      entityId: userId,
      details: `Changed role to ${role}`,
    },
  });

  return user;
}

export async function getAdminReferrals() {
  await requireAdmin();

  return db.referralCode.findMany({
    include: {
      createdBy: { select: { name: true, email: true } },
      usages: {
        include: {
          referredUser: { select: { name: true, email: true, createdAt: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminTickets() {
  await requireAdmin();

  return db.ticket.findMany({
    include: {
      user: { select: { name: true, email: true } },
      event: { select: { title: true, slug: true, date: true } },
      ticketTier: { select: { name: true, price: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function validateTicket(token: string) {
  const ticket = await db.ticket.findUnique({
    where: { token },
    include: {
      user: { select: { name: true, email: true } },
      event: { select: { title: true, date: true } },
      ticketTier: { select: { name: true } },
    },
  });

  if (!ticket) return { valid: false, error: "Ticket not found" };
  if (ticket.status === "USED") return { valid: false, error: "Ticket already used", ticket };
  if (ticket.status === "CANCELLED") return { valid: false, error: "Ticket cancelled", ticket };

  return { valid: true, ticket };
}

export async function scanTicket(token: string) {
  const session = await requireAdmin();

  const validation = await validateTicket(token);
  if (!validation.valid) return validation;

  await db.ticket.update({
    where: { token },
    data: { status: "USED", usedAt: new Date() },
  });

  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: "SCAN_TICKET",
      entity: "Ticket",
      entityId: validation.ticket!.id,
      details: `Scanned ticket for ${validation.ticket!.event.title}`,
    },
  });

  return { valid: true, ticket: validation.ticket, scanned: true };
}

export async function getAuditLogs(limit = 50) {
  await requireAdmin();

  return db.auditLog.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function createAnnouncement(data: {
  title: string;
  content: string;
  priority?: string;
}) {
  await requireAdmin();

  return db.announcement.create({
    data: {
      title: data.title,
      content: data.content,
      priority: data.priority || "NORMAL",
    },
  });
}

export async function getAnnouncements(activeOnly = false) {
  if (activeOnly) {
    return db.announcement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }
  return db.announcement.findMany({ orderBy: { createdAt: "desc" } });
}

export async function toggleAnnouncement(id: string) {
  await requireAdmin();

  const announcement = await db.announcement.findUnique({ where: { id } });
  if (!announcement) return { error: "Not found" };

  return db.announcement.update({
    where: { id },
    data: { isActive: !announcement.isActive },
  });
}

export async function deleteAnnouncement(id: string) {
  await requireAdmin();
  await db.announcement.delete({ where: { id } });
  return { success: true };
}

export async function addToWaitlist(data: {
  email: string;
  name?: string;
  message?: string;
}) {
  const existing = await db.waitlist.findUnique({
    where: { email: data.email },
  });
  if (existing) return { error: "Already on the waitlist" };

  await db.waitlist.create({ data });
  return { success: true };
}

export async function getWaitlist() {
  await requireAdmin();
  return db.waitlist.findMany({ orderBy: { createdAt: "desc" } });
}
