import { nanoid } from "nanoid";
import { db } from "./db";

export function generateReferralCode(): string {
  return nanoid(10).toUpperCase();
}

export function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(now.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

export async function canUserCreateReferral(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user || user.status !== "ACTIVE") return false;

  // Admins have unlimited referrals
  if (user.role === "ADMIN") return true;

  const weekStart = getWeekStart();

  let weeklyLimit = await db.weeklyInviteLimit.findUnique({
    where: { userId_weekStart: { userId, weekStart } },
  });

  if (!weeklyLimit) {
    weeklyLimit = await db.weeklyInviteLimit.create({
      data: { userId, weekStart, used: 0, limit: 3 },
    });
  }

  return weeklyLimit.used < weeklyLimit.limit;
}

export async function validateReferralCode(code: string) {
  const referralCode = await db.referralCode.findUnique({
    where: { code },
    include: { createdBy: true },
  });

  if (!referralCode) return { valid: false, error: "Invalid referral code" };
  if (!referralCode.isActive) return { valid: false, error: "This code is no longer active" };
  if (referralCode.usedCount >= referralCode.maxUses) return { valid: false, error: "This code has been fully used" };
  if (referralCode.expiresAt && referralCode.expiresAt < new Date()) return { valid: false, error: "This code has expired" };

  return { valid: true, referralCode };
}

export async function useReferralCode(code: string, newUserId: string) {
  const referralCode = await db.referralCode.findUnique({ where: { code } });
  if (!referralCode) throw new Error("Invalid referral code");

  await db.$transaction([
    db.referralUsage.create({
      data: {
        referralCodeId: referralCode.id,
        referredUserId: newUserId,
        referrerId: referralCode.createdById,
      },
    }),
    db.referralCode.update({
      where: { id: referralCode.id },
      data: { usedCount: { increment: 1 } },
    }),
  ]);
}
