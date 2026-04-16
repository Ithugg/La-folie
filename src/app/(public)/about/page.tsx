"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const chapters = [
  {
    label: "The Origin",
    text: "It started in the medinas. In the narrow streets where the sound of oud drifts through open windows and bass leaks from basement speakers at 3am. Three friends, raised on the same soil, fed by the same restless hunger — for something more, something louder, something that made the night feel infinite.",
  },
  {
    label: "The Crossing",
    text: "Morocco gave them roots. Atlanta gave them range. They landed in a city that pulses with rhythm — where hip-hop bleeds into house, where Southern soul meets electronic grit. They didn't try to fit in. They built their own frequency. Late nights in studios turned into warehouse parties. Warehouse parties turned into something people whispered about.",
  },
  {
    label: "The Sound",
    text: "One of them could turn a room inside out with a single transition — landscapes and memories woven into every set, deep melodic currents that made strangers hold their breath. He'd shared stages with names you'd recognize, but the rooms he cared about most were the ones with no names at all. Where the ceiling was low and the bass was honest.",
  },
  {
    label: "The Energy",
    text: "Another one didn't just play music — he conducted emotion. He was the tension before the drop. The silence that makes the next beat sacred. He understood that a great night isn't built in the speakers. It's built in the space between people. In the moment a stranger's eyes meet yours across a dark room and you both know: this is it.",
  },
  {
    label: "The Architecture",
    text: "And then there was the one who saw the bigger picture. While they dreamed in frequencies, he dreamed in blueprints. Every detail — from the weight of the paper an invitation was printed on to the angle of light hitting a concrete wall — passed through his eye. He didn't plan nights. He engineered feelings.",
  },
  {
    label: "The Pact",
    text: "One night, somewhere between a rooftop in Marrakech and a basement in Atlanta, they made a decision. No more playing by rules written for someone else's world. They would build their own. A place where the night wasn't consumed — it was created. Where every guest was chosen, every moment was intentional, and the only currency that mattered was trust.",
  },
  {
    label: "La Folie",
    text: "The French call it madness. But the best things always look like madness from the outside. La Folie is the name they gave to what they couldn't explain — that feeling when the lights go low and the room breathes as one. It's not a party. It's not a brand. It's a pact between people who believe that the night, done right, is the most honest thing in the world.",
  },
];

export default function AboutPage() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen">
      {/* Top minimal nav */}
      <nav className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between">
        <Link href="/" className="font-cursive text-2xl text-gradient-gold">
          La Folie
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/calendar"
            className="text-[11px] tracking-[0.3em] uppercase text-ivory/60 hover:text-ivory transition-colors"
          >
            Calendar
          </Link>
          <Link
            href="/account"
            className="text-[11px] tracking-[0.3em] uppercase text-ivory/60 hover:text-ivory transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative h-[80vh] flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-obsidian/40 to-obsidian" />
        <div className="absolute inset-0 grain-overlay" />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-4">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="w-12 h-px bg-gold/60 mx-auto mb-8"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gold/50 text-[10px] tracking-[0.6em] uppercase mb-6"
          >
            About Us
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="font-display text-6xl sm:text-7xl md:text-8xl font-light text-ivory leading-[0.9]"
          >
            Born from the
            <br />
            <span className="text-gradient-gold italic">underground</span>
          </motion.h1>
        </motion.div>
      </section>

      {/* Story chapters */}
      <section className="relative py-32 px-4">
        <div className="absolute inset-0 bg-radial-dark" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-accent text-2xl sm:text-3xl text-ivory/60 italic text-center mb-24 leading-relaxed"
          >
            Three friends. One shared obsession.
            <br />
            <span className="text-gold/50">The rest is history being written.</span>
          </motion.p>

          <div className="space-y-20">
            {chapters.map((chapter) => (
              <motion.div
                key={chapter.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute -left-6 sm:-left-10 top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-gold/10 to-transparent" />
                <div className="absolute -left-6 sm:-left-10 top-1 w-1.5 h-1.5 rounded-full bg-gold/60" />

                <p className="text-gold/40 text-[10px] tracking-[0.5em] uppercase mb-4">
                  {chapter.label}
                </p>
                <p className="text-ivory/50 text-[17px] leading-[2] font-light">
                  {chapter.text}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mt-32"
          >
            <div className="w-16 h-px bg-gold/30 mx-auto mb-8" />
            <p className="font-display text-4xl sm:text-5xl font-light text-ivory/30 italic mb-12">
              The madness continues.
            </p>
            <Link
              href="/account"
              className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden rounded-full"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-gold-dark via-gold to-gold-light opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="absolute inset-[1px] bg-obsidian/40 rounded-full group-hover:bg-transparent transition-all duration-500" />
              <span className="relative text-sm font-medium tracking-[0.15em] uppercase text-ivory group-hover:text-white transition-colors duration-500">
                Enter La Folie
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
