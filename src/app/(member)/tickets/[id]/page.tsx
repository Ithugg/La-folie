import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime, formatPrice } from "@/lib/utils";
import { generateQRCode, getTicketValidationUrl } from "@/lib/tickets";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/account");

  const ticket = await db.ticket.findFirst({
    where: { id, userId: session.user.id },
    include: {
      event: true,
      ticketTier: true,
      order: true,
    },
  });

  if (!ticket) notFound();

  const qrData = getTicketValidationUrl(ticket.token);
  const qrCode = await generateQRCode(qrData);

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
      <div className="max-w-md mx-auto">
        <Card variant="bordered" className="overflow-hidden">
          {/* Event Header */}
          <div className="bg-gradient-to-br from-gold/10 to-transparent p-6 border-b border-ash">
            <Badge variant={statusVariant(ticket.status)} className="mb-3">
              {ticket.status}
            </Badge>
            <h1 className="font-display text-2xl font-bold text-ivory">
              {ticket.event.title}
            </h1>
            <div className="mt-3 space-y-1 text-sm text-mist">
              <p>{formatDate(ticket.event.date)} at {formatTime(ticket.event.date)}</p>
              <p>{ticket.event.venue}</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="p-6 flex flex-col items-center">
            {ticket.status === "VALID" ? (
              <>
                <div className="bg-white p-4 rounded-2xl mb-4">
                  <img
                    src={qrCode}
                    alt="Ticket QR Code"
                    className="w-56 h-56"
                  />
                </div>
                <p className="text-xs text-mist text-center">
                  Show this QR code at the entrance
                </p>
              </>
            ) : ticket.status === "USED" ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-mist/30 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-mist">This ticket has been used</p>
                {ticket.usedAt && (
                  <p className="text-xs text-mist/60 mt-1">
                    Scanned at {formatTime(ticket.usedAt)}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-red-400">This ticket has been cancelled</p>
              </div>
            )}
          </div>

          {/* Ticket Details */}
          <div className="px-6 pb-6 space-y-3">
            <div className="flex justify-between text-sm border-t border-ash pt-4">
              <span className="text-mist">Tier</span>
              <span className="text-ivory font-medium">{ticket.ticketTier.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-mist">Price</span>
              <span className="text-gold font-medium">
                {formatPrice(ticket.ticketTier.price)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-mist">Token</span>
              <span className="text-ivory font-mono text-xs">{ticket.token}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
