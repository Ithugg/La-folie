"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUpAction } from "@/actions/auth";

export default function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signUpAction({
      name,
      email,
      password,
      referralCode: code,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-charcoal)_0%,_var(--color-obsidian)_70%)]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-4xl font-bold text-ivory mb-3">
            Welcome to La Folie
          </h2>
          <p className="text-mist mb-8">
            Your account has been created. The night awaits you.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3 text-sm font-semibold text-obsidian bg-gradient-to-r from-gold-dark via-gold to-gold-light rounded-lg"
          >
            Sign In Now
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-charcoal)_0%,_var(--color-obsidian)_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl font-bold text-gradient-gold">
            La Folie
          </Link>
          <p className="text-mist text-sm mt-3">
            You{"'"}ve been invited. Claim your place.
          </p>
          <div className="mt-3 inline-block px-3 py-1 rounded-full bg-gold/10 border border-gold/20">
            <span className="text-xs text-gold font-mono">{code}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="name"
            label="Full Name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Min. 8 chars, 1 uppercase, 1 number"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="w-full"
            loading={loading}
          >
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-mist mt-6">
          Already a member?{" "}
          <Link href="/login" className="text-gold hover:text-gold-light transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
