"use server";

import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import { signUpSchema, loginSchema } from "@/lib/validators";
import { validateReferralCode, useReferralCode } from "@/lib/referral";

export async function signUpAction(formData: {
  name: string;
  email: string;
  password: string;
  referralCode: string;
}) {
  const parsed = signUpSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password, referralCode } = parsed.data;

  // Check blacklist
  const blacklisted = await db.blacklist.findUnique({ where: { email } });
  if (blacklisted) {
    return { error: "This email cannot be used to create an account" };
  }

  // Check if user already exists
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists" };
  }

  // Validate referral code
  const validation = await validateReferralCode(referralCode);
  if (!validation.valid) {
    return { error: validation.error };
  }

  // Create user
  const hashedPassword = await hash(password, 12);
  const user = await db.user.create({
    data: {
      name,
      email,
      hashedPassword,
      role: "MEMBER",
      status: "ACTIVE",
    },
  });

  // Mark referral code as used
  await useReferralCode(referralCode, user.id);

  // Create audit log
  await db.auditLog.create({
    data: {
      userId: user.id,
      action: "SIGNUP",
      entity: "User",
      entityId: user.id,
      details: `User signed up with referral code: ${referralCode}`,
    },
  });

  return { success: true };
}

export async function loginAction(formData: {
  email: string;
  password: string;
}) {
  const parsed = loginSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" };
    }
    // Re-throw redirect errors (NextAuth redirects on success)
    throw error;
  }
}

export async function signOutAction() {
  await signOut({ redirect: false });
}
