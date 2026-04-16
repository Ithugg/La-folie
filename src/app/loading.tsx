export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
        </div>
        <p className="text-ivory/30 text-xs tracking-[0.3em] uppercase">Loading</p>
      </div>
    </div>
  );
}
