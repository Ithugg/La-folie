import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [tickets, referrals, events, announcements] = await Promise.all([
    db.ticket.count({ where: { userId: session.user.id } }),
    db.referralCode.count({ where: { createdById: session.user.id } }),
    db.event.findMany({
      where: { status: "PUBLISHED", date: { gte: new Date() } },
      include: { ticketTiers: { orderBy: { sortOrder: "asc" }, take: 1 } },
      orderBy: { date: "asc" },
      take: 3,
    }),
    db.announcement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ivory">
            Welcome back, <span className="text-gradient-gold">{session.user.name.split(" ")[0]}</span>
          </h1>
          <p className="text-mist mt-2">Your exclusive dashboard</p>
        </div>

        {/* Announcements */}
        {announcements.length > 0 && (
          <div className="mb-8 space-y-3">
            {announcements.map((a) => (
              <div
                key={a.id}
                className={`rounded-xl p-4 border ${
                  a.priority === "URGENT"
                    ? "bg-red-500/5 border-red-500/20"
                    : a.priority === "HIGH"
                    ? "bg-gold/5 border-gold/20"
                    : "bg-charcoal border-ash/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className={`w-5 h-5 ${a.priority === "URGENT" ? "text-red-400" : "text-gold"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-ivory">{a.title}</h3>
                    <p className="text-xs text-mist mt-1">{a.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Card variant="bordered">
            <p className="text-xs text-mist uppercase tracking-wider mb-1">My Tickets</p>
            <p className="text-3xl font-display font-bold text-ivory">{tickets}</p>
          </Card>
          <Card variant="bordered">
            <p className="text-xs text-mist uppercase tracking-wider mb-1">Referrals Sent</p>
            <p className="text-3xl font-display font-bold text-ivory">{referrals}</p>
          </Card>
          <Card variant="bordered">
            <p className="text-xs text-mist uppercase tracking-wider mb-1">Status</p>
            <Badge variant="gold" className="mt-2">Active Member</Badge>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <Link href="/referrals">
            <Card variant="bordered" className="hover:border-gold/30 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-ivory">Invite Someone</h3>
                  <p className="text-xs text-mist">Generate a referral code</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/tickets">
            <Card variant="bordered" className="hover:border-gold/30 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-ivory">My Tickets</h3>
                  <p className="text-xs text-mist">View your tickets & QR codes</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Upcoming Events */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-ivory">Upcoming Events</h2>
            <Link href="/events" className="text-sm text-gold hover:text-gold-light transition-colors">
              View all
            </Link>
          </div>
          {events.length === 0 ? (
            <Card variant="bordered">
              <p className="text-center text-mist py-8">No upcoming events. Stay tuned.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <Link key={event.id} href={`/events/${event.slug}`}>
                  <Card variant="bordered" className="hover:border-gold/20 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gold/60 uppercase tracking-wider">{formatDate(event.date)}</p>
                        <h3 className="font-display text-lg font-bold text-ivory mt-1 group-hover:text-gold transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-sm text-mist mt-1">{event.venue}</p>
                      </div>
                      <div className="text-right">
                        {event.ticketTiers[0] && (
                          <p className="text-gold font-semibold">
                            From {formatPrice(event.ticketTiers[0].price)}
                          </p>
                        )}
                        {event.featured && <Badge variant="gold" className="mt-1">Featured</Badge>}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
