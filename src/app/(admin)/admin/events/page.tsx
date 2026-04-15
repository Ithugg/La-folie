import { getAllEvents } from "@/actions/events";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils";
import Link from "next/link";

export default async function AdminEventsPage() {
  const events = await getAllEvents();

  const statusVariant = (status: string) => {
    switch (status) {
      case "PUBLISHED": return "success" as const;
      case "DRAFT": return "default" as const;
      case "CANCELLED": return "danger" as const;
      case "PAST": return "info" as const;
      default: return "default" as const;
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ivory">Events</h1>
          <p className="text-mist mt-1">{events.length} total events</p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-obsidian bg-gradient-to-r from-gold-dark via-gold to-gold-light rounded-lg hover:opacity-90 transition-opacity"
        >
          Create Event
        </Link>
      </div>

      <div className="space-y-4">
        {events.map((event) => {
          const totalRevenue = event.ticketTiers.reduce(
            (sum, t) => sum + t.price * t.sold,
            0
          );
          const totalSold = event.ticketTiers.reduce((sum, t) => sum + t.sold, 0);

          return (
            <Link key={event.id} href={`/admin/events/${event.id}`}>
              <Card variant="bordered" className="hover:border-gold/20 transition-all cursor-pointer">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={statusVariant(event.status)}>{event.status}</Badge>
                      {event.featured && <Badge variant="gold">Featured</Badge>}
                    </div>
                    <h3 className="font-display text-xl font-bold text-ivory">{event.title}</h3>
                    <p className="text-sm text-mist mt-1">
                      {formatDate(event.date)} &middot; {event.venue}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-gold font-display text-lg font-bold">
                      {formatPrice(totalRevenue)}
                    </p>
                    <p className="text-xs text-mist">
                      {totalSold} / {event.capacity || "unlimited"} tickets
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
