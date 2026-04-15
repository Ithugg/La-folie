"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/actions/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await loginAction({ email, password });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // If no error, NextAuth handles the redirect to /dashboard
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-32 relative">
      <div className="absolute inset-0 bg-radial-dark" />
      <div className="absolute inset-0 grain-overlay" />

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold/[0.04] rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-12 h-px bg-gold/40 mx-auto mb-8"
          />
          <Link href="/" className="font-cursive text-5xl text-gradient-gold">
            La Folie
          </Link>
          <p className="text-ivory/30 text-sm mt-4 tracking-wide">Welcome back to the madness</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
            >
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-ivory/30 mt-8">
          Don{"'"}t have an account?{" "}
          <Link
            href="/access"
            className="text-gold/70 hover:text-gold transition-colors duration-300"
          >
            Request access
          </Link>
        </p>

        <div className="w-8 h-px bg-gold/20 mx-auto mt-8" />
      </motion.div>
    </div>
  );
}
