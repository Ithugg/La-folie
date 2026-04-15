import { getAdminTickets } from "@/actions/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function AdminTicketsPage() {
  const tickets = await getAdminTickets();

  const statusVariant = (status: string) => {
    switch (status) {
      case "VALID": return "success" as const;
      case "USED": return "default" as const;
      case "CANCELLED": return "danger" as const;
      default: return "default" as const;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ivory">Tickets</h1>
        <p className="text-mist mt-1">{tickets.length} total tickets</p>
      </div>

      {tickets.length === 0 ? (
        <Card variant="bordered">
          <p className="text-center text-mist py-8">No tickets sold yet</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <Card key={ticket.id} variant="bordered" padding="sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
                <div className="flex items-center gap-4">
                  <Badge variant={statusVariant(ticket.status)}>
                    {ticket.status}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium text-ivory">
                      {ticket.event.title} — {ticket.ticketTier.name}
                    </p>
                    <p className="text-xs text-mist">
                      {ticket.user.name} ({ticket.user.email})
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-gold font-semibold text-sm">
                    {formatPrice(ticket.ticketTier.price)}
                  </p>
                  <p className="text-xs text-mist">{formatDate(ticket.event.date)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
