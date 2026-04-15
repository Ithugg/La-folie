"use client";

import { motion } from "framer-motion";

const founders = [
  {
    name: "DJ Axiom",
    role: "Sonic Architect",
    description:
      "Pioneer of dark melodic techno. 15 years behind the decks, from Berlin's underground to Ibiza's hidden rooms.",
    initial: "A",
  },
  {
    name: "DJ Noctis",
    role: "Night Curator",
    description:
      "Master of atmosphere and space. Every venue, every light, every moment is orchestrated to perfection.",
    initial: "N",
  },
  {
    name: "DJ Elara",
    role: "Frequency Alchemist",
    description:
      "Blending hypnotic rhythms with ethereal soundscapes. Where deep house meets the cosmos.",
    initial: "E",
  },
];

export function FoundersSection() {
  return (
    <section className="py-32 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-gold/60 text-xs tracking-[0.4em] uppercase mb-4">
            The Visionaries
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-ivory">
            Three minds. One <span className="text-gradient-gold">mission.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {founders.map((founder, i) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-2xl bg-charcoal border border-ash/50 p-8 hover:border-gold/20 transition-all duration-500">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-6 group-hover:from-gold/30 group-hover:to-gold/10 transition-all">
                  <span className="font-display text-3xl font-bold text-gold">
                    {founder.initial}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-ivory mb-1">
                  {founder.name}
                </h3>
                <p className="text-gold/80 text-sm font-medium mb-4">
                  {founder.role}
                </p>
                <p className="text-sm text-mist leading-relaxed">
                  {founder.description}
                </p>

                {/* Decorative line */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
