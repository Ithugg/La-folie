"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-charcoal)_0%,_var(--color-obsidian)_70%)]" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-[100px]" />
      </div>

      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gold/80 text-sm tracking-[0.3em] uppercase mb-6"
          >
            By Invitation Only
          </motion.p>

          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6">
            <span className="text-gradient-gold">La Folie</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl sm:text-2xl text-mist font-light max-w-2xl mx-auto mb-4"
          >
            Where the night belongs to the chosen few
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-mist/60 max-w-lg mx-auto mb-12"
          >
            An exclusive underground nightlife collective, curated by three visionaries.
            Every event is a statement. Every guest is handpicked.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/access"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-obsidian overflow-hidden rounded-lg"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-gold-dark via-gold to-gold-light" />
              <span className="absolute inset-0 bg-gradient-to-r from-gold-dark via-gold-light to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative">Request Access</span>
            </Link>
            <Link
              href="/story"
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-ivory border border-ash hover:border-mist rounded-lg transition-colors"
            >
              Our Story
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-mist/30 flex items-start justify-center p-1"
          >
            <div className="w-1 h-2 bg-gold/60 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
