"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction, signUpAction } from "@/actions/auth";

type Tab = "signin" | "register";

interface Props {
  initialCode: string;
  initialTab: Tab;
  redirectTo: string;
}

export function AccountForm({ initialCode, initialTab, redirectTo }: Props) {
  const [tab, setTab] = useState<Tab>(initialTab);

  // Sign in state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInError, setSignInError] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);

  // Register state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState(initialCode);
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setSignInLoading(true);
    setSignInError("");
    const result = await loginAction({
      email: signInEmail,
      password: signInPassword,
      redirectTo,
    });
    if (result?.error) {
      setSignInError(result.error);
      setSignInLoading(false);
    }
    // success path: NextAuth redirects
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError("");
    const result = await signUpAction({
      name,
      email,
      password,
      referralCode: referralCode.trim().toUpperCase(),
    });
    if (result.error) {
      setRegisterError(result.error);
      setRegisterLoading(false);
    } else {
      setRegisterSuccess(true);
      setRegisterLoading(false);
    }
  }

  if (registerSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center max-w-md"
      >
        <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-10 h-10 text-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="font-display text-4xl font-light text-ivory mb-2">
          Welcome to{" "}
          <span className="font-cursive text-gradient-gold text-5xl">La Folie</span>
        </h2>
        <p className="text-ivory/40 mt-4 mb-10 leading-relaxed">
          Your account has been created. The night awaits you.
        </p>
        <button
          onClick={() => {
            setTab("signin");
            setRegisterSuccess(false);
            setSignInEmail(email);
          }}
          className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden rounded-full"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-gold-dark via-gold to-gold-light opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="absolute inset-[1px] bg-obsidian/40 rounded-full group-hover:bg-transparent transition-all duration-500" />
          <span className="relative text-sm font-medium tracking-[0.15em] uppercase text-ivory group-hover:text-white transition-colors duration-500">
            Sign In Now
          </span>
        </button>
      </motion.div>
    );
  }

  return (
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
        <p className="text-ivory/40 text-sm mt-4 tracking-wide">
          {tab === "signin" ? "Welcome back to the madness" : "Claim your place inside"}
        </p>
      </div>

      {/* Tab toggle */}
      <div className="flex items-center justify-center gap-1 mb-6 p-1 rounded-full bg-charcoal/50 border border-white/[0.06] w-fit mx-auto">
        <button
          onClick={() => setTab("signin")}
          className={`px-5 py-2 text-[10px] tracking-[0.25em] uppercase rounded-full transition-all duration-300 ${
            tab === "signin" ? "bg-gold/15 text-gold" : "text-ivory/40 hover:text-ivory/70"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setTab("register")}
          className={`px-5 py-2 text-[10px] tracking-[0.25em] uppercase rounded-full transition-all duration-300 ${
            tab === "register" ? "bg-gold/15 text-gold" : "text-ivory/40 hover:text-ivory/70"
          }`}
        >
          Register
        </button>
      </div>

      <div className="glass rounded-2xl p-8">
        <AnimatePresence mode="wait">
          {tab === "signin" ? (
            <motion.form
              key="signin"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSignIn}
              className="space-y-6"
            >
              <Input
                id="signin-email"
                label="Email"
                type="email"
                placeholder="your@email.com"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                required
              />
              <Input
                id="signin-password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                required
              />
              {signInError && (
                <p className="text-sm text-red-400 text-center">{signInError}</p>
              )}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={signInLoading}
              >
                Sign In
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleRegister}
              className="space-y-6"
            >
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
              <Input
                id="register-name"
                label="Full Name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                id="register-email"
                label="Email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                id="register-password"
                label="Password"
                type="password"
                placeholder="Min. 8 chars, 1 uppercase, 1 number"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {registerError && (
                <p className="text-sm text-red-400 text-center">{registerError}</p>
              )}
              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full"
                loading={registerLoading}
              >
                Create Account
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <div className="w-8 h-px bg-gold/20 mx-auto mt-8" />
    </motion.div>
  );
}
