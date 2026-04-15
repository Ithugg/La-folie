"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { updateEvent, deleteEvent } from "@/actions/events";
import { formatPrice } from "@/lib/utils";

export default function AdminEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setEvent(data);
        setLoading(false);
      });
  }, [id]);

  async function handleSave() {
    setSaving(true);
    setError("");

    const result = await updateEvent(id, {
      title: event.title,
      description: event.description,
      date: event.date,
      venue: event.venue,
      address: event.address,
      status: event.status,
      featured: event.featured,
      capacity: event.capacity,
    });

    if (result.error) setError(result.error);
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this event?")) return;
    await deleteEvent(id);
    router.push("/admin/events");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full" />
      </div>
    );
  }

  if (!event) {
    return <p className="text-mist">Event not found</p>;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ivory">Edit Event</h1>
          <p className="text-mist mt-1">{event.title}</p>
        </div>
        <Button variant="danger" onClick={handleDelete}>
          Delete Event
        </Button>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card variant="bordered">
          <div className="space-y-4">
            <Input
              id="title"
              label="Title"
              value={event.title}
              onChange={(e) => setEvent({ ...event, title: e.target.value })}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-mist">Description</label>
              <textarea
                className="w-full px-4 py-3 rounded-lg bg-charcoal border border-ash text-ivory placeholder:text-mist/50 focus:outline-none focus:ring-2 focus:ring-gold/30 min-h-[120px] resize-none"
                value={event.description}
                onChange={(e) => setEvent({ ...event, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="venue"
                label="Venue"
                value={event.venue}
                onChange={(e) => setEvent({ ...event, venue: e.target.value })}
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-mist">Status</label>
                <select
                  className="w-full px-4 py-3 rounded-lg bg-charcoal border border-ash text-ivory focus:outline-none focus:ring-2 focus:ring-gold/30"
                  value={event.status}
                  onChange={(e) => setEvent({ ...event, status: e.target.value })}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="PAST">Past</option>
                </select>
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={event.featured}
                onChange={(e) => setEvent({ ...event, featured: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-mist">Featured event</span>
            </label>
          </div>
        </Card>

        {/* Ticket Tiers (read-only view) */}
        {event.ticketTiers && event.ticketTiers.length > 0 && (
          <Card variant="bordered">
            <h2 className="font-display text-lg font-bold text-ivory mb-4">Ticket Tiers</h2>
            <div className="space-y-3">
              {event.ticketTiers.map((tier: any) => (
                <div key={tier.id} className="flex items-center justify-between p-3 rounded-lg bg-obsidian/50 border border-ash/30">
                  <div>
                    <p className="text-sm font-medium text-ivory">{tier.name}</p>
                    <p className="text-xs text-mist">{tier.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold font-semibold">{formatPrice(tier.price)}</p>
                    <p className="text-xs text-mist">
                      {tier.sold} / {tier.quantity} sold
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-4">
          <Button variant="gold" size="lg" onClick={handleSave} loading={saving}>
            Save Changes
          </Button>
          <Button variant="secondary" size="lg" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
