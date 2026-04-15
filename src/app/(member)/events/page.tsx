import { db } from "@/lib/db";
import { formatDate, formatTime, formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function MemberEventsPage() {
  const events = await db.event.findMany({
    where: { status: "PUBLISHED" },
    include: {
      ticketTiers: { orderBy: { sortOrder: "asc" }, take: 1 },
      _count: { select: { tickets: true } },
    },
    orderBy: { date: "asc" },
  });

  const upcoming = events.filter((e) => new Date(e.date) >= new Date());
  const past = events.filter((e) => new Date(e.date) < new Date());

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-ivory">Events</h1>
          <p className="text-mist mt-2">Browse and book exclusive events</p>
        </div>

        {/* Upcoming */}
        <div className="mb-12">
          <h2 className="font-display text-xl font-bold text-ivory mb-4">Upcoming</h2>
          {upcoming.length === 0 ? (
            <div className="rounded-xl bg-charcoal border border-ash/50 p-8 text-center">
              <p className="text-mist">No upcoming events at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcoming.map((event) => (
                <Link key={event.id} href={`/events/${event.slug}`}>
                  <div className="group rounded-xl bg-charcoal border border-ash/50 hover:border-gold/20 transition-all p-6 cursor-pointer">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {event.featured && <Badge variant="gold">Featured</Badge>}
                          <span className="text-xs text-mist/60 uppercase tracking-wider">
                            {formatDate(event.date)} &middot; {formatTime(event.date)}
                          </span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-ivory group-hover:text-gold transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-sm text-mist mt-1">{event.venue}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {event.ticketTiers[0] && (
                          <p className="text-gold font-display text-lg font-bold">
                            From {formatPrice(event.ticketTiers[0].price)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Past */}
        {past.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-bold text-ivory mb-4 opacity-60">Past Events</h2>
            <div className="space-y-3 opacity-60">
              {past.map((event) => (
                <div key={event.id} className="rounded-xl bg-charcoal/50 border border-ash/30 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-mist/40 uppercase tracking-wider">{formatDate(event.date)}</p>
                      <h3 className="font-display text-lg font-bold text-mist">{event.title}</h3>
                    </div>
                    <Badge variant="default">Past</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
