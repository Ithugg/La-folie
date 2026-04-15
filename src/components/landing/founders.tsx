"use client";

import { motion } from "framer-motion";

const founders = [
  {
    moniker: "The Sound",
    symbol: "I",
    tagline: "Where rhythm meets the soul",
    description:
      "Born where the Atlas Mountains meet the Atlantic, shaped by the raw energy of a city that never sleeps. He turned the landscapes of his homeland into frequencies — blending deep electronic pulses with melodic textures that move through you, not just around you. From rooftops in Casablanca to stages alongside the world's biggest names in Atlanta, his sound became the heartbeat of something bigger. Music isn't what he does. It's what he is.",
  },
  {
    moniker: "The Energy",
    symbol: "II",
    tagline: "Every night has a feeling. He creates it.",
    description:
      "The one who walks into a room and changes its gravity. There's a depth to his sets that you feel before you hear — an emotional architecture built from instinct, not formula. He brings the contrast: the tension before the drop, the silence that makes the bass hit harder, the moment where strangers become family on the dancefloor. He doesn't play music. He conducts human energy.",
  },
  {
    moniker: "The Vision",
    symbol: "III",
    tagline: "Ideas are nothing without execution.",
    description:
      "While they dream in frequencies, he dreams in blueprints. The one who sees the bigger picture before it exists — who turns a feeling into a brand, a night into a movement, and three friends into a force. Discipline meets ambition. Every detail, from the typography on an invitation to the architecture of a venue, passes through his eye. He doesn't just plan the future. He builds it.",
  },
];

export function FoundersSection() {
  return (
    <section className="relative py-40 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.07]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-obsidian/95" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="text-center mb-8"
        >
          <p className="text-gold/50 text-[10px] tracking-[0.6em] uppercase mb-6 font-body">
            The Visionaries
          </p>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-light text-ivory leading-[1.1]">
            Three friends.<br />
            <span className="text-gradient-gold italic">One shared obsession.</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-accent text-center text-ivory/40 italic text-lg max-w-xl mx-auto mb-20"
        >
          They came from the same soil — where the call to prayer mixes with
          bass lines, and the scent of mint tea lingers in rooms that don{"'"}t
          close until dawn. Morocco made them. Atlanta forged them.
        </motion.p>

        {/* Founders */}
        <div className="space-y-6">
          {founders.map((founder, i) => (
            <motion.div
              key={founder.moniker}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            >
              <div className="group glass hover-glow rounded-2xl overflow-hidden transition-all duration-700">
                <div className="p-8 sm:p-10 md:p-12">
                  <div className="flex flex-col md:flex-row md:items-start gap-8">
                    {/* Left — Symbol & Title */}
                    <div className="md:w-1/3 flex-shrink-0">
                      <span className="text-gold/15 font-display text-8xl font-light leading-none select-none group-hover:text-gold/25 transition-colors duration-700">
                        {founder.symbol}
                      </span>
                      <h3 className="font-display text-3xl sm:text-4xl font-light text-ivory mt-4 group-hover:text-gold transition-colors duration-500">
                        {founder.moniker}
                      </h3>
                      <p className="text-gold/60 text-sm font-accent italic mt-2">
                        {founder.tagline}
                      </p>
                    </div>

                    {/* Right — Description */}
                    <div className="md:w-2/3">
                      <div className="w-8 h-px bg-gold/30 mb-6 hidden md:block" />
                      <p className="text-ivory/45 leading-[1.9] text-[15px] group-hover:text-ivory/60 transition-colors duration-500">
                        {founder.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
