import { getAdminStats, getAuditLogs } from "@/actions/admin";
import { Card } from "@/components/ui/card";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
  const [stats, logs] = await Promise.all([
    getAdminStats(),
    getAuditLogs(10),
  ]);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, color: "text-ivory" },
    { label: "Total Events", value: stats.totalEvents, color: "text-ivory" },
    { label: "Tickets Sold", value: stats.totalTickets, color: "text-ivory" },
    {
      label: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      color: "text-gold",
    },
    { label: "New Users (7d)", value: stats.recentUsers, color: "text-green-400" },
    {
      label: "Active Referral Codes",
      value: stats.activeReferralCodes,
      color: "text-blue-400",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ivory">Dashboard</h1>
        <p className="text-mist mt-1">Overview of La Folie operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {statCards.map((stat) => (
          <Card key={stat.label} variant="bordered">
            <p className="text-xs text-mist uppercase tracking-wider">{stat.label}</p>
            <p className={`text-3xl font-display font-bold mt-2 ${stat.color}`}>
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="font-display text-xl font-bold text-ivory mb-4">
          Recent Activity
        </h2>
        <Card variant="bordered" padding="sm">
          {logs.length === 0 ? (
            <p className="text-mist text-center py-8">No activity yet</p>
          ) : (
            <div className="divide-y divide-ash/50">
              {logs.map((log) => (
                <div key={log.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        log.action.includes("CREATE")
                          ? "success"
                          : log.action.includes("DELETE")
                          ? "danger"
                          : "default"
                      }
                    >
                      {log.action}
                    </Badge>
                    <div>
                      <p className="text-sm text-ivory">{log.details || log.entity}</p>
                      {log.user && (
                        <p className="text-xs text-mist">by {log.user.name}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-mist/60 flex-shrink-0">
                    {formatDateTime(log.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
