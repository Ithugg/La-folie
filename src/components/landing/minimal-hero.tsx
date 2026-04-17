"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SmokeBackground } from "@/components/ui/spooky-smoke-animation";

export function MinimalHero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-obsidian">
      {/* Animated smoke */}
      <div className="absolute inset-0 z-0">
        <SmokeBackground smokeColor="#FF0000" />
      </div>

      {/* Top wordmark */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-10 left-1/2 -translate-x-1/2 z-20"
      >
        <Link
          href="/"
          className="font-cursive text-5xl sm:text-6xl text-gradient-gold select-none"
        >
          La Folie
        </Link>
      </motion.div>

      {/* Centered content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-ivory/50 text-[10px] sm:text-xs tracking-[0.5em] uppercase mb-8"
        >
          La Folie
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-ivory leading-[1.1] max-w-3xl"
        >
          Where the night belongs
          <br />
          <span className="italic text-ivory/90">to the chosen few.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="font-accent italic text-ivory/40 text-sm sm:text-base mt-8 max-w-md"
        >
          By invitation only. The door is almost closed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-12"
        >
          <Link
            href="/account"
            className="group relative inline-flex items-center justify-center px-12 py-4 overflow-hidden rounded-full"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-gold-dark via-gold to-gold-light opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="absolute inset-[1px] bg-obsidian/50 rounded-full group-hover:bg-obsidian/20 transition-all duration-500" />
            <span className="relative text-sm font-medium tracking-[0.3em] uppercase text-ivory group-hover:text-white transition-colors duration-500">
              Enter
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Right-edge vertical nav (desktop) */}
      <motion.nav
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 z-30 flex-col gap-8 items-end"
      >
        <Link
          href="/calendar"
          className="text-[11px] tracking-[0.3em] uppercase text-ivory/60 hover:text-ivory transition-colors duration-300"
        >
          Calendar
        </Link>
        <Link
          href="/about"
          className="text-[11px] tracking-[0.3em] uppercase text-ivory/60 hover:text-ivory transition-colors duration-300"
        >
          About Us
        </Link>
        <Link
          href="/account"
          className="text-[11px] tracking-[0.3em] uppercase text-ivory/60 hover:text-ivory transition-colors duration-300"
        >
          Sign In
        </Link>
      </motion.nav>

      {/* Mobile nav (bottom bar) */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-6 px-5 py-3 rounded-full bg-obsidian/60 backdrop-blur-md border border-white/5"
      >
        <Link
          href="/calendar"
          className="text-[10px] tracking-[0.25em] uppercase text-ivory/70 hover:text-ivory transition-colors duration-300"
        >
          Calendar
        </Link>
        <Link
          href="/about"
          className="text-[10px] tracking-[0.25em] uppercase text-ivory/70 hover:text-ivory transition-colors duration-300"
        >
          About
        </Link>
        <Link
          href="/account"
          className="text-[10px] tracking-[0.25em] uppercase text-ivory/70 hover:text-ivory transition-colors duration-300"
        >
          Sign In
        </Link>
      </motion.nav>
    </section>
  );
}
