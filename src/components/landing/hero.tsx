"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      {/* Background image with parallax */}
      <motion.div style={{ scale }} className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=1920&q=80')`,
          }}
        />
        {/* Dark cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/50 to-obsidian" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/60 via-transparent to-obsidian/60" />
        {/* Gold tint */}
        <div className="absolute inset-0 bg-gold/[0.03] mix-blend-overlay" />
      </motion.div>

      {/* Film grain */}
      <div className="absolute inset-0 grain-overlay pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gold/[0.06] rounded-full blur-[150px] animate-glow" />

      {/* Content */}
      <motion.div style={{ opacity, y }} className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
            className="w-16 h-px bg-gold/60 mx-auto mb-8 origin-center"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-gold/70 text-[11px] sm:text-xs tracking-[0.5em] uppercase mb-8 font-body"
          >
            By Invitation Only
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
            className="font-display text-[80px] sm:text-[110px] md:text-[140px] lg:text-[170px] font-light leading-[0.85] tracking-[-0.02em] mb-8"
          >
            <span className="font-cursive text-gradient-gold">La Folie</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="font-accent text-lg sm:text-xl md:text-2xl text-ivory/70 font-normal italic max-w-xl mx-auto mb-12 leading-relaxed"
          >
            Where the night belongs to the chosen few
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/access"
              className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden rounded-full"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-gold-dark via-gold to-gold-light opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="absolute inset-[1px] bg-obsidian/40 rounded-full group-hover:bg-transparent transition-all duration-500" />
              <span className="relative text-sm font-medium tracking-[0.15em] uppercase text-ivory group-hover:text-obsidian transition-colors duration-500">
                Request Access
              </span>
            </Link>
            <Link
              href="/story"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm tracking-[0.1em] uppercase text-ivory/50 hover:text-gold transition-colors duration-500"
            >
              <span>Discover</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Bottom fade line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="w-[1px] h-10 bg-gradient-to-b from-transparent via-gold/40 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
