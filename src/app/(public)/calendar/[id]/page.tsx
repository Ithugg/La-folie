import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { formatDate, formatTime, formatPrice } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TicketPurchaseButton } from "./purchase-button";

export const dynamic = "force-dynamic";

export default async function CalendarEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const isAuthed = !!session?.user?.id;

  // Try by slug first, then by ID
  let event = await db.event.findUnique({
    where: { slug: id },
    include: { ticketTiers: { orderBy: { sortOrder: "asc" } } },
  });
  if (!event) {
    event = await db.event.findUnique({
      where: { id },
      include: { ticketTiers: { orderBy: { sortOrder: "asc" } } },
    });
  }

  if (!event || event.status !== "PUBLISHED") notFound();

  const redirectPath = `/calendar/${event.slug}`;

  return (
    <div className="min-h-screen relative">
      {/* Top minimal nav */}
      <nav className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between">
        <Link href="/" className="font-cursive text-2xl text-gradient-gold">
          La Folie
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/calendar"
            className="text-[11px] tracking-[0.3em] uppercase text-ivory/60 hover:text-ivory transition-colors"
          >
            Calendar
          </Link>
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
            {isAuthed ? "Account" : "Sign In"}
          </Link>
        </div>
      </nav>

      <div className="absolute inset-0 bg-radial-dark pointer-events-none" />
      <div className="absolute inset-0 grain-overlay pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-32 pb-24">
        <Link
          href="/calendar"
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-ivory/40 hover:text-ivory transition-colors mb-10"
        >
          <span className="w-4 h-px bg-current" />
          Back to Calendar
        </Link>

        <div className="mb-10">
          {event.featured && (
            <Badge variant="gold" className="mb-3">
              Featured Event
            </Badge>
          )}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-ivory leading-[1.1] mb-6">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-ivory/50 text-sm">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {formatTime(event.date)}
              {event.endDate && ` - ${formatTime(event.endDate)}`}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
              {event.venue}
            </span>
          </div>
        </div>

        <Card variant="bordered" className="mb-10">
          <h2 className="font-display text-lg font-light text-ivory mb-3 tracking-wide">
            About this night
          </h2>
          <p className="text-ivory/60 leading-[1.9] whitespace-pre-wrap text-[15px]">
            {event.description}
          </p>
          {event.address && (
            <p className="text-sm text-ivory/40 mt-6">
              <strong className="text-ivory/60">Address:</strong> {event.address}
            </p>
          )}
        </Card>

        <h2 className="font-display text-xl font-light text-ivory mb-4 tracking-wide">
          Tickets
        </h2>
        <div className="space-y-4">
          {event.ticketTiers.length === 0 ? (
            <p className="text-ivory/40 text-sm italic">
              Tickets are not yet available for this event.
            </p>
          ) : (
            event.ticketTiers.map((tier) => {
              const available = tier.quantity - tier.sold;
              const soldOut = available <= 0;
              return (
                <Card
                  key={tier.id}
                  variant="bordered"
                  className={
                    soldOut ? "opacity-50" : "hover:border-gold/20 transition-colors"
                  }
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-ivory text-lg">{tier.name}</h3>
                      {tier.description && (
                        <p className="text-sm text-ivory/50 mt-1">{tier.description}</p>
                      )}
                      <p className="text-xs text-ivory/40 mt-2">
                        {soldOut ? "Sold out" : `${available} remaining`}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-2xl font-display font-light text-gold">
                        {formatPrice(tier.price, tier.currency)}
                      </p>
                      <TicketPurchaseButton
                        eventId={event.id}
                        tierId={tier.id}
                        isAuthed={isAuthed}
                        soldOut={soldOut}
                        redirectPath={redirectPath}
                      />
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
