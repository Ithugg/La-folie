"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  getAdminUsers,
  getAdmins,
  getAdminCount,
  updateUserStatus,
  inviteAdmin,
  removeAdmin,
} from "@/actions/admin";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [adminCount, setAdminCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMsg, setInviteMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [usersData, adminsData, count] = await Promise.all([
      getAdminUsers(),
      getAdmins(),
      getAdminCount(),
    ]);
    setUsers(usersData);
    setAdmins(adminsData);
    setAdminCount(count);
    setLoading(false);
  }

  async function handleStatusChange(userId: string, status: string) {
    await updateUserStatus(userId, status);
    loadData();
  }

  async function handleRemoveAdmin(userId: string) {
    const result = await removeAdmin(userId);
    if (result.error) {
      setInviteMsg({ type: "error", text: result.error });
    } else {
      setInviteMsg({ type: "success", text: "Admin access removed." });
    }
    loadData();
  }

  async function handleInviteAdmin(e: React.FormEvent) {
    e.preventDefault();
    setInviteLoading(true);
    setInviteMsg(null);

    const result = await inviteAdmin(inviteEmail);
    if (result.error) {
      setInviteMsg({ type: "error", text: result.error });
    } else {
      setInviteMsg({ type: "success", text: `${result.user?.name} has been promoted to admin.` });
      setInviteEmail("");
    }
    setInviteLoading(false);
    loadData();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full" />
      </div>
    );
  }

  const nonAdminUsers = users.filter((u) => u.role !== "ADMIN");

  return (
    <div>
      {/* Admin Management Panel */}
      <div className="mb-12">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-light text-ivory">Admin Management</h1>
          <p className="text-ivory/30 text-sm mt-2">
            {adminCount} of 3 admin slots used
          </p>
        </div>

        {/* Admin slots visualization */}
        <div className="flex gap-3 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex-1 rounded-2xl p-5 transition-all duration-500 ${
                admins[i]
                  ? "glass-gold"
                  : "glass border-dashed border-gold/10"
              }`}
            >
              {admins[i] ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <span className="font-display text-sm text-gold">
                        {admins[i].name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ivory">{admins[i].name}</p>
                      <p className="text-xs text-ivory/30">{admins[i].email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAdmin(admins[i].id)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center py-2">
                  <p className="text-xs text-ivory/20 tracking-[0.1em] uppercase">Empty slot</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Invite Admin */}
        {adminCount < 3 && (
          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-medium text-ivory mb-4">Invite Admin by Email</h3>
            <form onSubmit={handleInviteAdmin} className="flex gap-3">
              <div className="flex-1">
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="user@email.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" variant="gold" loading={inviteLoading}>
                Promote to Admin
              </Button>
            </form>
            {inviteMsg && (
              <p className={`text-sm mt-3 ${inviteMsg.type === "error" ? "text-red-400" : "text-green-400"}`}>
                {inviteMsg.text}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-12" />

      {/* All Users */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-light text-ivory">All Members</h2>
            <p className="text-ivory/30 text-sm mt-1">{nonAdminUsers.length} members</p>
          </div>
        </div>

        <div className="space-y-3">
          {nonAdminUsers.map((user) => (
            <div key={user.id} className="glass rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-charcoal border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-sm text-ivory/60">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-ivory">{user.name}</p>
                      <Badge
                        variant={
                          user.status === "ACTIVE"
                            ? "success"
                            : user.status === "SUSPENDED"
                            ? "info"
                            : "danger"
                        }
                      >
                        {user.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-ivory/30">{user.email}</p>
                    <p className="text-xs text-ivory/20 mt-0.5">
                      Joined {formatDate(user.createdAt)} &middot;{" "}
                      {user._count.tickets} tickets &middot;{" "}
                      {user._count.referralCodes} referrals
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {user.status === "ACTIVE" && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleStatusChange(user.id, "SUSPENDED")}
                    >
                      Suspend
                    </Button>
                  )}
                  {user.status === "SUSPENDED" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleStatusChange(user.id, "ACTIVE")}
                    >
                      Reactivate
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
