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
    <div className="min-h-screen flex items-center justify-center px-4 py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-charcoal)_0%,_var(--color-obsidian)_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        {submitted ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-3xl font-bold text-ivory mb-3">
              You{"'"}re on the list
            </h2>
            <p className="text-mist">
              We{"'"}ll review your request and reach out if there{"'"}s a place for you
              among us. The wait is part of the experience.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <p className="text-gold/60 text-xs tracking-[0.3em] uppercase mb-3">
                Request Access
              </p>
              <h1 className="font-display text-4xl font-bold text-ivory mb-3">
                Join the waitlist
              </h1>
              <p className="text-mist text-sm">
                Don{"'"}t have an invitation? Tell us why you belong.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-mist">
                  Why La Folie?
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg bg-charcoal border border-ash text-ivory placeholder:text-mist/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all duration-200 min-h-[100px] resize-none"
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
          </>
        )}
      </motion.div>
    </div>
  );
}
