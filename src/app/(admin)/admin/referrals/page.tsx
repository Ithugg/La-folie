import { getAdminReferrals } from "@/actions/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function AdminReferralsPage() {
  const referrals = await getAdminReferrals();

  const totalUsed = referrals.filter((r) => r.usedCount > 0).length;
  const totalActive = referrals.filter((r) => r.isActive && r.usedCount < r.maxUses).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ivory">Referrals</h1>
        <p className="text-mist mt-1">
          {referrals.length} total codes &middot; {totalActive} active &middot; {totalUsed} used
        </p>
      </div>

      <div className="space-y-3">
        {referrals.map((ref) => (
          <Card key={ref.id} variant="bordered" padding="sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
              <div className="flex items-center gap-4">
                <code className="text-sm font-mono text-gold bg-gold/5 px-3 py-1 rounded">
                  {ref.code}
                </code>
                <div>
                  <p className="text-sm text-ivory">
                    by {ref.createdBy.name}
                  </p>
                  <p className="text-xs text-mist">
                    {formatDate(ref.createdAt)} &middot;{" "}
                    {ref.usedCount}/{ref.maxUses} uses
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {ref.usedCount >= ref.maxUses ? (
                  <Badge variant="success">Fully Used</Badge>
                ) : ref.isActive ? (
                  <Badge variant="gold">Active</Badge>
                ) : (
                  <Badge variant="danger">Inactive</Badge>
                )}
                {ref.usages.length > 0 && (
                  <div className="text-xs text-mist">
                    {ref.usages.map((u: any) => (
                      <span key={u.id} className="block">
                        → {u.referredUser.name} ({u.referredUser.email})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
