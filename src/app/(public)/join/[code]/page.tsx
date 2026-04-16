"use client";

import { useState, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUpAction } from "@/actions/auth";

export default function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
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
      <div className="min-h-screen flex items-center justify-center px-4 py-32 relative">
        <div className="absolute inset-0 bg-radial-dark" />
        <div className="absolute inset-0 grain-overlay" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold/[0.06] rounded-full blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-4xl font-light text-ivory mb-2">
            Welcome to <span className="font-cursive text-gradient-gold text-5xl">La Folie</span>
          </h2>
          <p className="text-ivory/30 mt-4 mb-10 leading-relaxed">
            Your account has been created. The night awaits you.
          </p>
          <Link
            href="/login"
            className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden rounded-full"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-gold-dark via-gold to-gold-light opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="absolute inset-[1px] bg-obsidian/40 rounded-full group-hover:bg-transparent transition-all duration-500" />
            <span className="relative text-sm font-medium tracking-[0.15em] uppercase text-ivory group-hover:text-white transition-colors duration-500">
              Sign In Now
            </span>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-32 relative">
      <div className="absolute inset-0 bg-radial-dark" />
      <div className="absolute inset-0 grain-overlay" />
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
          <p className="text-ivory/30 text-sm mt-4 tracking-wide">
            You{"'"}ve been invited. Claim your place.
          </p>
          <div className="mt-4 inline-block px-4 py-1.5 rounded-full glass-gold">
            <span className="text-xs text-gold/80 font-mono tracking-wider">{code}</span>
          </div>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
        </div>

        <p className="text-center text-sm text-ivory/30 mt-8">
          Already a member?{" "}
          <Link href="/login" className="text-gold/70 hover:text-gold transition-colors duration-300">
            Sign in
          </Link>
        </p>

        <div className="w-8 h-px bg-gold/20 mx-auto mt-8" />
      </motion.div>
    </div>
  );
}
