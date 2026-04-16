"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="relative py-40 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-radial-gold" />
      <div className="absolute inset-0 grain-overlay" />

      {/* Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold/[0.06] rounded-full blur-[120px] animate-glow" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {/* Decorative */}
          <div className="w-12 h-px bg-gold/40 mx-auto mb-10" />

          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-light text-ivory mb-8 leading-[1.1]">
            The door is<br />
            <span className="text-gradient-gold italic">almost closed.</span>
          </h2>

          <p className="font-accent text-ivory/40 text-lg italic mb-4 max-w-md mx-auto">
            La Folie is not for everyone. And that{"'"}s the point.
          </p>
          <p className="text-ivory/30 text-sm mb-12 max-w-lg mx-auto leading-relaxed">
            If someone on the inside trusts you enough to share their code, use it.
            Otherwise, tell us why you belong — and we{"'"}ll decide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/access"
              className="group relative inline-flex items-center justify-center px-12 py-4 overflow-hidden rounded-full"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-gold-dark via-gold to-gold-light opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="absolute inset-[1px] bg-obsidian/40 rounded-full group-hover:bg-transparent transition-all duration-500" />
              <span className="relative text-sm font-medium tracking-[0.15em] uppercase text-ivory group-hover:text-white transition-colors duration-500">
                Request Access
              </span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-3 px-8 py-4 text-sm tracking-[0.1em] uppercase text-gold/60 hover:text-gold transition-colors duration-500"
            >
              <span className="w-4 h-px bg-current" />
              I Have an Invitation
            </Link>
          </div>

          {/* Bottom decorative */}
          <div className="w-12 h-px bg-gold/20 mx-auto mt-16" />
        </motion.div>
      </div>
    </section>
  );
}
