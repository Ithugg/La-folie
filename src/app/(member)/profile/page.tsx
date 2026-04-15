import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { SignOutButton } from "./sign-out-button";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: { select: { tickets: true, referralCodes: true } },
      flags: true,
      referredBy: {
        include: { referrer: { select: { name: true } } },
        take: 1,
      },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-ivory">Profile</h1>
        </div>

        {/* User Info */}
        <Card variant="bordered" className="mb-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center flex-shrink-0">
              <span className="font-display text-2xl font-bold text-gold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="font-display text-xl font-bold text-ivory">{user.name}</h2>
              <p className="text-sm text-mist">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={user.role === "ADMIN" ? "gold" : "success"}>
                  {user.role}
                </Badge>
                <Badge variant="success">{user.status}</Badge>
                {user.flags.map((flag) => (
                  <Badge key={flag.id} variant="info">{flag.flag}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card variant="bordered" padding="sm">
            <p className="text-xs text-mist uppercase tracking-wider">Tickets</p>
            <p className="text-2xl font-display font-bold text-ivory mt-1">
              {user._count.tickets}
            </p>
          </Card>
          <Card variant="bordered" padding="sm">
            <p className="text-xs text-mist uppercase tracking-wider">Referrals</p>
            <p className="text-2xl font-display font-bold text-ivory mt-1">
              {user._count.referralCodes}
            </p>
          </Card>
          <Card variant="bordered" padding="sm">
            <p className="text-xs text-mist uppercase tracking-wider">Member Since</p>
            <p className="text-sm font-medium text-ivory mt-2">
              {formatDate(user.createdAt)}
            </p>
          </Card>
        </div>

        {/* Referred by */}
        {user.referredBy.length > 0 && (
          <Card variant="bordered" className="mb-6">
            <p className="text-xs text-mist uppercase tracking-wider mb-1">Referred by</p>
            <p className="text-ivory font-medium">
              {user.referredBy[0].referrer.name}
            </p>
          </Card>
        )}

        {/* Sign Out */}
        <SignOutButton />
      </div>
    </div>
  );
}
