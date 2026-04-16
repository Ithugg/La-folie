import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian px-4">
      <div className="text-center max-w-md">
        <div className="w-12 h-px bg-gold/40 mx-auto mb-8" />
        <h1 className="font-display text-7xl font-light text-ivory mb-4">404</h1>
        <p className="font-accent text-lg text-ivory/40 italic mb-2">
          This page doesn{"'"}t exist
        </p>
        <p className="text-ivory/20 text-sm mb-10">
          The page you{"'"}re looking for has vanished into the night.
        </p>
        <Link
          href="/"
          className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden rounded-full"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-gold-dark via-gold to-gold-light opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="absolute inset-[1px] bg-obsidian/40 rounded-full group-hover:bg-transparent transition-all duration-500" />
          <span className="relative text-sm font-medium tracking-[0.15em] uppercase text-ivory group-hover:text-white transition-colors duration-500">
            Return Home
          </span>
        </Link>
        <div className="w-8 h-px bg-gold/20 mx-auto mt-12" />
      </div>
    </div>
  );
}
