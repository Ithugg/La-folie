import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-ash/50 bg-obsidian">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-xl font-bold text-gradient-gold mb-3">
              La Folie
            </h3>
            <p className="text-sm text-mist max-w-xs">
              An exclusive, referral-only nightlife experience. By invitation only.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-ivory mb-3">Navigate</h4>
            <div className="flex flex-col gap-2">
              <Link href="/story" className="text-sm text-mist hover:text-gold transition-colors">
                Our Story
              </Link>
              <Link href="/events" className="text-sm text-mist hover:text-gold transition-colors">
                Events
              </Link>
              <Link href="/access" className="text-sm text-mist hover:text-gold transition-colors">
                Request Access
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-ivory mb-3">Legal</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-mist">Terms of Service</span>
              <span className="text-sm text-mist">Privacy Policy</span>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-ash/50 text-center">
          <p className="text-xs text-mist">
            &copy; {new Date().getFullYear()} La Folie. All rights reserved. Entry by invitation only.
          </p>
        </div>
      </div>
    </footer>
  );
}
