"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addToWaitlist } from "@/actions/admin";

export default function AccessPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
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
        ) : (
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
                Don{"'"}t have an invitation? Tell us why you belong.
              </p>
            </div>

            <div className="glass rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
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
          </>
        )}
      </motion.div>
    </div>
  );
}
