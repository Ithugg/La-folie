"use client";

import { motion } from "framer-motion";

export default function StoryPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-32 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-charcoal)_0%,_var(--color-obsidian)_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold/60 text-xs tracking-[0.4em] uppercase mb-4">
              Origin Story
            </p>
            <h1 className="font-display text-5xl sm:text-6xl font-bold text-ivory mb-6">
              Born from the <span className="text-gradient-gold">underground</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto space-y-12">
          {[
            {
              year: "The Beginning",
              text: "Three DJs. One shared obsession: creating nights that people remember forever. Not just events — experiences that blur the line between reality and ecstasy. We met in the dark corners of warehouses, connected by a frequency only a few can hear.",
            },
            {
              year: "The Vision",
              text: "The mainstream nightlife scene felt hollow. Overpriced bottles, overcrowded floors, overproduced music. We wanted the opposite: intimate gatherings where every soul in the room was there because they truly belonged. Where the music wasn't background — it was the heartbeat.",
            },
            {
              year: "The Code",
              text: "La Folie operates on one rule: you can only enter if someone on the inside vouches for you. No PR lists. No influencer tables. No exceptions. This isn't exclusivity for its own sake — it's a filter that ensures every night maintains its magic.",
            },
            {
              year: "The Future",
              text: "What started as underground gatherings has evolved into a movement. Each event pushes boundaries further. Secret locations, immersive experiences, and a community that grows stronger with every shared sunrise. The madness is just beginning.",
            },
          ].map((section, i) => (
            <motion.div
              key={section.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative pl-8 border-l border-gold/20"
            >
              <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-gold -translate-x-[5px]" />
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">
                {section.year}
              </p>
              <p className="text-mist leading-relaxed text-lg">
                {section.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
