import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
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
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-radial-dark pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Welcome */}
        <div className="mb-12">
          <div className="w-10 h-px bg-gold/40 mb-6" />
          <h1 className="font-display text-4xl sm:text-5xl font-light text-ivory">
            Welcome back, <span className="text-gradient-gold italic">{session.user.name.split(" ")[0]}</span>
          </h1>
          <p className="text-ivory/30 text-sm mt-3 tracking-wide">Your exclusive dashboard</p>
        </div>

        {/* Announcements */}
        {announcements.length > 0 && (
          <div className="mb-10 space-y-3">
            {announcements.map((a) => (
              <div
                key={a.id}
                className={`glass rounded-xl p-5 ${
                  a.priority === "URGENT"
                    ? "border-red-500/20"
                    : a.priority === "HIGH"
                    ? "border-gold/20"
                    : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${a.priority === "URGENT" ? "bg-red-500/10" : "bg-gold/10"}`}>
                      <svg className={`w-4 h-4 ${a.priority === "URGENT" ? "text-red-400" : "text-gold"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-ivory">{a.title}</h3>
                    <p className="text-xs text-ivory/30 mt-1">{a.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="glass hover-glow rounded-2xl p-6 transition-all duration-500">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold/50 mb-3">My Tickets</p>
            <p className="text-4xl font-display font-light text-ivory">{tickets}</p>
          </div>
          <div className="glass hover-glow rounded-2xl p-6 transition-all duration-500">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold/50 mb-3">Referrals Sent</p>
            <p className="text-4xl font-display font-light text-ivory">{referrals}</p>
          </div>
          <div className="glass hover-glow rounded-2xl p-6 transition-all duration-500">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold/50 mb-3">Status</p>
            <Badge variant="gold" className="mt-2">Active Member</Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <Link href="/referrals">
            <div className="glass hover-glow rounded-2xl p-6 cursor-pointer group transition-all duration-500">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/10 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/20 transition-all duration-500">
                  <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-ivory group-hover:text-gold transition-colors duration-300">Invite Someone</h3>
                  <p className="text-xs text-ivory/30 mt-0.5">Generate a referral code</p>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/tickets">
            <div className="glass hover-glow rounded-2xl p-6 cursor-pointer group transition-all duration-500">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/10 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/20 transition-all duration-500">
                  <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-ivory group-hover:text-gold transition-colors duration-300">My Tickets</h3>
                  <p className="text-xs text-ivory/30 mt-0.5">View your tickets & QR codes</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Upcoming Events */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl font-light text-ivory">Upcoming Events</h2>
            <Link href="/events" className="text-[10px] tracking-[0.15em] uppercase text-gold/60 hover:text-gold transition-colors duration-300">
              View all
            </Link>
          </div>
          {events.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <p className="text-ivory/30 italic">No upcoming events. Stay tuned.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <Link key={event.id} href={`/events/${event.slug}`}>
                  <div className="glass hover-glow rounded-2xl p-6 cursor-pointer group transition-all duration-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] tracking-[0.2em] uppercase text-gold/50">{formatDate(event.date)}</p>
                        <h3 className="font-display text-xl font-light text-ivory mt-2 group-hover:text-gold transition-colors duration-300">
                          {event.title}
                        </h3>
                        <p className="text-xs text-ivory/30 mt-1">{event.venue}</p>
                      </div>
                      <div className="text-right">
                        {event.ticketTiers[0] && (
                          <p className="text-gold/80 font-display text-lg">
                            From {formatPrice(event.ticketTiers[0].price)}
                          </p>
                        )}
                        {event.featured && <Badge variant="gold" className="mt-2">Featured</Badge>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
