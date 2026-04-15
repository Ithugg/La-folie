import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  referralCode: z.string().min(1, "Referral code is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  endDate: z.string().optional(),
  venue: z.string().min(1, "Venue is required"),
  address: z.string().optional(),
  imageUrl: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "PAST"]).default("DRAFT"),
  featured: z.boolean().default(false),
  capacity: z.number().optional(),
});

export const ticketTierSchema = z.object({
  name: z.string().min(1, "Tier name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  currency: z.string().default("EUR"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export const waitlistSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
  message: z.string().optional(),
});

export const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
});
