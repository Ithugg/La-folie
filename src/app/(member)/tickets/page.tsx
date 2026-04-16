import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function TicketsPage() {
  const session = await auth();
  if (!session?.user) redirect("/account");

  const tickets = await db.ticket.findMany({
    where: { userId: session.user.id },
    include: {
      event: true,
      ticketTier: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const statusVariant = (status: string) => {
    switch (status) {
      case "VALID": return "success" as const;
      case "USED": return "default" as const;
      case "CANCELLED": return "danger" as const;
      default: return "default" as const;
    }
  };

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-ivory">My Tickets</h1>
          <p className="text-mist mt-2">Your event tickets and QR codes</p>
        </div>

        {tickets.length === 0 ? (
          <Card variant="bordered">
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-mist/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <p className="text-mist mb-2">No tickets yet</p>
              <Link href="/calendar" className="text-gold text-sm hover:text-gold-light transition-colors">
                Browse events
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                <Card variant="bordered" className="hover:border-gold/20 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={statusVariant(ticket.status)}>
                          {ticket.status}
                        </Badge>
                        <span className="text-xs text-mist/60">{ticket.ticketTier.name}</span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-ivory group-hover:text-gold transition-colors">
                        {ticket.event.title}
                      </h3>
                      <p className="text-sm text-mist mt-1">{formatDate(ticket.event.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gold font-semibold">
                        {formatPrice(ticket.ticketTier.price)}
                      </p>
                      <p className="text-xs text-mist mt-1">View QR</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
