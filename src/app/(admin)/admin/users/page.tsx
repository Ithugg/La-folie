"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAdminUsers, updateUserStatus, updateUserRole } from "@/actions/admin";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    const data = await getAdminUsers();
    setUsers(data);
    setLoading(false);
  }

  async function handleStatusChange(userId: string, status: string) {
    await updateUserStatus(userId, status);
    loadUsers();
  }

  async function handleRoleChange(userId: string, role: string) {
    await updateUserRole(userId, role);
    loadUsers();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ivory">Users</h1>
          <p className="text-mist mt-1">{users.length} total users</p>
        </div>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <Card key={user.id} variant="bordered" padding="sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-sm font-bold text-gold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-ivory">{user.name}</p>
                    <Badge variant={user.role === "ADMIN" ? "gold" : "default"}>
                      {user.role}
                    </Badge>
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
                  <p className="text-xs text-mist">{user.email}</p>
                  <p className="text-xs text-mist/60 mt-0.5">
                    Joined {formatDate(user.createdAt)} &middot;{" "}
                    {user._count.tickets} tickets &middot;{" "}
                    {user._count.referralCodes} referrals
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {user.role !== "ADMIN" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRoleChange(user.id, "ADMIN")}
                  >
                    Make Admin
                  </Button>
                )}
                {user.role === "ADMIN" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRoleChange(user.id, "MEMBER")}
                  >
                    Remove Admin
                  </Button>
                )}
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
          </Card>
        ))}
      </div>
    </div>
  );
}
