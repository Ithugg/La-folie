import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate, formatTime, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const now = new Date();
  const events = await db.event.findMany({
    where: {
      status: "PUBLISHED",
      date: { gte: now },
    },
    include: {
      ticketTiers: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: { date: "asc" },
  });

  return (
    <div className="min-h-screen relative">
      {/* Top minimal nav */}
      <nav className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between">
        <Link href="/" className="font-cursive text-2xl text-gradient-gold">
          La Folie
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/about"
            className="text-[11px] tracking-[0.3em] uppercase text-ivory/60 hover:text-ivory transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/account"
            className="text-[11px] tracking-[0.3em] uppercase text-ivory/60 hover:text-ivory transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      <div className="absolute inset-0 bg-radial-dark pointer-events-none" />
      <div className="absolute inset-0 grain-overlay pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-40 pb-24">
        <div className="text-center mb-16">
          <div className="w-12 h-px bg-gold/40 mx-auto mb-8" />
          <p className="text-gold/50 text-[10px] tracking-[0.6em] uppercase mb-6">
            Upcoming Nights
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-light text-ivory leading-[1.1]">
            The <span className="italic text-gradient-gold">Calendar</span>
          </h1>
          <p className="text-ivory/40 text-sm mt-6 max-w-md mx-auto leading-relaxed">
            Every night is chosen. Every room is intentional. Here is what&apos;s coming.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-ivory/40 italic font-accent text-lg">
              The next chapter is being written.
            </p>
            <p className="text-ivory/30 text-sm mt-4">
              Check back soon — or secure your place inside.
            </p>
            <div className="mt-10">
              <Link
                href="/account"
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-gold/70 hover:text-gold transition-colors"
              >
                <span className="w-4 h-px bg-current" />
                Request Access
                <span className="w-4 h-px bg-current" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Link key={event.id} href={`/calendar/${event.slug}`}>
                <div className="group rounded-2xl glass hover-glow p-6 sm:p-8 transition-all duration-500 cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {event.featured && <Badge variant="gold">Featured</Badge>}
                        <span className="text-[10px] text-ivory/40 uppercase tracking-[0.3em]">
                          {formatDate(event.date)} · {formatTime(event.date)}
                        </span>
                      </div>
                      <h3 className="font-display text-2xl sm:text-3xl font-light text-ivory group-hover:text-gold transition-colors duration-500">
                        {event.title}
                      </h3>
                      <p className="text-sm text-ivory/40 mt-2">{event.venue}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {event.ticketTiers[0] && (
                        <p className="text-gold/80 font-display text-lg font-light">
                          From {formatPrice(event.ticketTiers[0].price, event.ticketTiers[0].currency)}
                        </p>
                      )}
                      <p className="text-[10px] text-ivory/30 uppercase tracking-[0.25em] mt-1">
                        View &rarr;
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
