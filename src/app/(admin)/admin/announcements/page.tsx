"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  createAnnouncement,
  getAnnouncements,
  toggleAnnouncement,
  deleteAnnouncement,
} from "@/actions/admin";
import { formatDate } from "@/lib/utils";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", priority: "NORMAL" });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    setLoading(true);
    const data = await getAnnouncements();
    setAnnouncements(data);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    await createAnnouncement(form);
    setForm({ title: "", content: "", priority: "NORMAL" });
    setShowForm(false);
    setCreating(false);
    loadAnnouncements();
  }

  async function handleToggle(id: string) {
    await toggleAnnouncement(id);
    loadAnnouncements();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this announcement?")) return;
    await deleteAnnouncement(id);
    loadAnnouncements();
  }

  const priorityVariant = (p: string) => {
    switch (p) {
      case "URGENT": return "danger" as const;
      case "HIGH": return "gold" as const;
      case "LOW": return "default" as const;
      default: return "info" as const;
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ivory">Announcements</h1>
          <p className="text-mist mt-1">{announcements.length} announcements</p>
        </div>
        <Button variant="gold" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "New Announcement"}
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card variant="bordered" className="mb-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              id="title"
              label="Title"
              placeholder="Announcement title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-mist">Content</label>
              <textarea
                className="w-full px-4 py-3 rounded-lg bg-charcoal border border-ash text-ivory placeholder:text-mist/50 focus:outline-none focus:ring-2 focus:ring-gold/30 min-h-[100px] resize-none"
                placeholder="Announcement content..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-mist">Priority</label>
              <select
                className="w-full px-4 py-3 rounded-lg bg-charcoal border border-ash text-ivory focus:outline-none focus:ring-2 focus:ring-gold/30"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <Button type="submit" variant="gold" loading={creating}>
              Publish
            </Button>
          </form>
        </Card>
      )}

      {/* Announcements List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full" />
        </div>
      ) : announcements.length === 0 ? (
        <Card variant="bordered">
          <p className="text-center text-mist py-8">No announcements yet</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <Card key={a.id} variant="bordered" padding="sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 px-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={priorityVariant(a.priority)}>{a.priority}</Badge>
                    <Badge variant={a.isActive ? "success" : "default"}>
                      {a.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-xs text-mist/60">{formatDate(a.createdAt)}</span>
                  </div>
                  <h3 className="text-sm font-medium text-ivory">{a.title}</h3>
                  <p className="text-xs text-mist mt-1">{a.content}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggle(a.id)}
                  >
                    {a.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(a.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
