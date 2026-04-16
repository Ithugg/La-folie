"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  generateReferralCode,
  canUserCreateReferral,
  getWeekStart,
} from "@/lib/referral";

export async function createReferralCode() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const canCreate = await canUserCreateReferral(session.user.id);
  if (!canCreate) {
    return { error: "You've reached your weekly invite limit" };
  }

  const code = generateReferralCode();

  await db.referralCode.create({
    data: {
      code,
      createdById: session.user.id,
      maxUses: 1,
      isActive: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  // Update weekly usage for non-admin users
  if (session.user.role !== "ADMIN") {
    const weekStart = getWeekStart();
    await db.weeklyInviteLimit.upsert({
      where: { userId_weekStart: { userId: session.user.id, weekStart } },
      update: { used: { increment: 1 } },
      create: { userId: session.user.id, weekStart, used: 1, limit: 3 },
    });
  }

  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: "CREATE_REFERRAL",
      entity: "ReferralCode",
      details: `Generated referral code: ${code}`,
    },
  });

  return { success: true, code };
}

export async function getUserReferrals() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const referrals = await db.referralCode.findMany({
    where: { createdById: session.user.id },
    include: {
      usages: {
        include: { referredUser: { select: { name: true, email: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return { referrals };
}

export async function getReferralStats() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const weekStart = getWeekStart();

  const weeklyLimit = await db.weeklyInviteLimit.findUnique({
    where: { userId_weekStart: { userId: session.user.id, weekStart } },
  });

  const totalReferrals = await db.referralUsage.count({
    where: { referrerId: session.user.id },
  });

  const allActiveCodes = await db.referralCode.findMany({
    where: {
      createdById: session.user.id,
      isActive: true,
    },
    select: { usedCount: true, maxUses: true },
  });
  const activeCodesCount = allActiveCodes.filter(c => c.usedCount < c.maxUses).length;

  return {
    weeklyUsed: weeklyLimit?.used || 0,
    weeklyLimit: session.user.role === "ADMIN" ? Infinity : (weeklyLimit?.limit || 3),
    totalReferrals,
    activeCodesCount,
  };
}

export async function deactivateReferralCode(codeId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const code = await db.referralCode.findUnique({ where: { id: codeId } });
  if (!code || (code.createdById !== session.user.id && session.user.role !== "ADMIN")) {
    return { error: "Not authorized" };
  }

  await db.referralCode.update({
    where: { id: codeId },
    data: { isActive: false },
  });

  return { success: true };
}
