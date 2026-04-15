"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addToWaitlist } from "@/actions/admin";

export default function AccessPage() {
  const router = useRouter();
  const [view, setView] = useState<"main" | "waitlist">("main");

  // Referral code state
  const [referralCode, setReferralCode] = useState("");

  // Waitlist state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = referralCode.trim().toUpperCase();
    if (!code) return;
    router.push(`/join/${encodeURIComponent(code)}`);
  }

  async function handleWaitlistSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await addToWaitlist({ email, name, message });

    if (result.error) {
      setError(result.error);
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-32 relative">
      <div className="absolute inset-0 bg-radial-dark" />
      <div className="absolute inset-0 grain-overlay" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/[0.04] rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Waitlist success */}
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-4xl font-light text-ivory mb-4">
              You{"'"}re on the list
            </h2>
            <p className="text-ivory/30 leading-relaxed">
              We{"'"}ll review your request and reach out if there{"'"}s a place for you
              among us. The wait is part of the experience.
            </p>
            <div className="w-8 h-px bg-gold/20 mx-auto mt-10" />
          </motion.div>
        ) : view === "main" ? (
          <>
            {/* Header */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="w-12 h-px bg-gold/40 mx-auto mb-8"
              />
              <p className="text-gold/50 text-[10px] tracking-[0.5em] uppercase mb-6">
                Enter the Circle
              </p>
              <h1 className="font-display text-5xl sm:text-6xl font-light text-ivory mb-4 leading-[1.1]">
                Got an<br />
                <span className="text-gradient-gold italic">invitation?</span>
              </h1>
              <p className="text-ivory/30 text-sm mt-4 max-w-xs mx-auto leading-relaxed">
                If someone on the inside trusted you enough to share their code, enter it below.
              </p>
            </div>

            {/* Referral Code Input */}
            <div className="glass rounded-2xl p-8 mb-6">
              <form onSubmit={handleCodeSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-ivory/40">
                    Referral Code
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 rounded-xl bg-charcoal/50 border border-white/[0.06] text-ivory text-center font-mono text-lg tracking-[0.2em] uppercase placeholder:text-ivory/15 placeholder:tracking-[0.2em] focus:outline-none focus:ring-1 focus:ring-gold/30 focus:border-gold/20 transition-all duration-300"
                    placeholder="FOLIE-XXXXXX"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full"
                >
                  Claim My Spot
                </Button>
              </form>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/10" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-ivory/20">or</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/10" />
            </div>

            {/* Waitlist option */}
            <div className="text-center">
              <p className="text-ivory/30 text-sm mb-4">
                Don{"'"}t have a code? Join the waitlist.
              </p>
              <button
                onClick={() => setView("waitlist")}
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-gold/60 hover:text-gold transition-colors duration-300"
              >
                <span className="w-4 h-px bg-current" />
                Request Access
                <span className="w-4 h-px bg-current" />
              </button>
            </div>
          </>
        ) : (
          /* Waitlist form */
          <>
            <div className="text-center mb-10">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="w-12 h-px bg-gold/40 mx-auto mb-8"
              />
              <p className="text-gold/50 text-[10px] tracking-[0.5em] uppercase mb-6">
                Request Access
              </p>
              <h1 className="font-display text-5xl sm:text-6xl font-light text-ivory mb-4 leading-[1.1]">
                Join the<br />
                <span className="text-gradient-gold italic">waitlist</span>
              </h1>
              <p className="text-ivory/30 text-sm mt-4">
                Tell us why you belong. We{"'"}ll decide.
              </p>
            </div>

            <div className="glass rounded-2xl p-8">
              <form onSubmit={handleWaitlistSubmit} className="space-y-6">
                <Input
                  id="name"
                  label="Your Name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                <div className="space-y-2">
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-ivory/40">
                    Why La Folie?
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl bg-charcoal/50 border border-white/[0.06] text-ivory placeholder:text-ivory/20 focus:outline-none focus:ring-1 focus:ring-gold/30 focus:border-gold/20 transition-all duration-300 min-h-[120px] resize-none text-sm"
                    placeholder="Tell us about yourself and why you want access..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

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
                  Submit Request
                </Button>
              </form>
            </div>

            <button
              onClick={() => setView("main")}
              className="block mx-auto mt-8 text-[11px] tracking-[0.15em] uppercase text-ivory/30 hover:text-gold/60 transition-colors duration-300"
            >
              &larr; I have a referral code
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
