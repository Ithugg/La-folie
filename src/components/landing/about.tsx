"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function AboutSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const lineWidth = useTransform(scrollYProgress, [0.1, 0.4], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative py-40 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-radial-dark" />
      <div className="absolute top-0 left-0 right-0 h-px line-fade" />
      <div className="absolute bottom-0 left-0 right-0 h-px line-fade" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/[0.04] rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-24"
        >
          <p className="text-gold/50 text-[10px] tracking-[0.6em] uppercase mb-6 font-body">
            The Philosophy
          </p>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-light text-ivory mb-8 leading-[1.1]">
            Not a club.<br />
            <span className="text-gradient-gold italic">A collective.</span>
          </h2>
          {/* Animated gold line */}
          <motion.div style={{ width: lineWidth }} className="h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent mx-auto" />
        </motion.div>

        {/* Manifesto text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto text-center mb-24"
        >
          <p className="font-accent text-lg sm:text-xl text-ivory/50 leading-relaxed italic">
            We don{"'"}t open doors for everyone. We open them for the right ones.
            Every night we create is a world unto itself — fleeting, unrepeatable,
            and reserved for those who understand that the best things in life
            aren{"'"}t found. They{"'"}re whispered about.
          </p>
        </motion.div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              number: "01",
              title: "Curated",
              description:
                "Every guest enters through a personal invitation. No walk-ins. No exceptions. The door is a promise between friends.",
            },
            {
              number: "02",
              title: "Underground",
              description:
                "Secret locations, unreleased sounds, unexpected collisions of art and energy. We exist in the spaces the mainstream can't reach.",
            },
            {
              number: "03",
              title: "Elevated",
              description:
                "World-class sound design, obsessive aesthetics, and an atmosphere that makes time irrelevant. This is nightlife at its highest form.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="group relative"
            >
              <div className="glass hover-glow rounded-2xl p-8 h-full transition-all duration-500">
                {/* Number */}
                <span className="text-gold/20 font-display text-6xl font-light absolute top-4 right-6 select-none group-hover:text-gold/30 transition-colors duration-500">
                  {item.number}
                </span>

                <div className="relative">
                  <h3 className="font-display text-2xl font-light text-ivory mb-4 group-hover:text-gold transition-colors duration-500">
                    {item.title}
                  </h3>
                  <p className="text-sm text-ivory/40 leading-relaxed group-hover:text-ivory/60 transition-colors duration-500">
                    {item.description}
                  </p>
                </div>

                {/* Bottom line */}
                <div className="absolute bottom-0 left-8 right-8 h-px bg-gold/0 group-hover:bg-gold/20 transition-all duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
