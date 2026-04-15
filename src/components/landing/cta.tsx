"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-ivory mb-6">
            Ready to enter the{" "}
            <span className="text-gradient-gold">madness</span>?
          </h2>
          <p className="text-mist text-lg mb-10 max-w-xl mx-auto">
            La Folie is not for everyone. If you know someone on the inside,
            ask them for an invitation. Otherwise, request access and we{"'"}ll
            decide if you belong.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/access"
              className="group relative inline-flex items-center justify-center px-10 py-4 text-sm font-semibold text-obsidian overflow-hidden rounded-lg"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-gold-dark via-gold to-gold-light" />
              <span className="absolute inset-0 bg-gradient-to-r from-gold-dark via-gold-light to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative">Request Access</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-10 py-4 text-sm font-medium text-gold border border-gold/30 rounded-lg hover:bg-gold/5 transition-colors"
            >
              I Have an Invitation
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
