import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative border-t border-gold/10 overflow-hidden">
      <div className="absolute inset-0 bg-radial-dark" />
      <div className="absolute inset-0 grain-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-cursive text-3xl text-gradient-gold mb-4">
              La Folie
            </h3>
            <p className="text-sm text-ivory/30 max-w-xs leading-relaxed">
              An exclusive, referral-only nightlife collective. Born from obsession.
              Entry by invitation only.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-gold/50 mb-5">
              Navigate
            </h4>
            <div className="flex flex-col gap-3">
              <Link href="/story" className="text-sm text-ivory/40 hover:text-gold transition-colors duration-300">
                Our Story
              </Link>
              <Link href="/events" className="text-sm text-ivory/40 hover:text-gold transition-colors duration-300">
                Events
              </Link>
              <Link href="/access" className="text-sm text-ivory/40 hover:text-gold transition-colors duration-300">
                Request Access
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-gold/50 mb-5">
              Legal
            </h4>
            <div className="flex flex-col gap-3">
              <span className="text-sm text-ivory/30">Terms of Service</span>
              <span className="text-sm text-ivory/30">Privacy Policy</span>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-gold/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[11px] tracking-[0.1em] text-ivory/20">
            &copy; {new Date().getFullYear()} La Folie. All rights reserved.
          </p>
          <p className="text-[11px] tracking-[0.1em] text-ivory/20 italic">
            Entry by invitation only.
          </p>
        </div>
      </div>
    </footer>
  );
}
