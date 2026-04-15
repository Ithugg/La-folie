"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createEvent } from "@/actions/events";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    endDate: "",
    venue: "",
    address: "",
    capacity: "",
    featured: false,
    status: "DRAFT",
  });

  const [tiers, setTiers] = useState([
    { name: "General", description: "Standard entry", price: "35", quantity: "100" },
  ]);

  function addTier() {
    setTiers([...tiers, { name: "", description: "", price: "", quantity: "" }]);
  }

  function removeTier(index: number) {
    setTiers(tiers.filter((_, i) => i !== index));
  }

  function updateTier(index: number, field: string, value: string) {
    const updated = [...tiers];
    (updated[index] as any)[field] = value;
    setTiers(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await createEvent({
      title: form.title,
      description: form.description,
      date: form.date,
      endDate: form.endDate || undefined,
      venue: form.venue,
      address: form.address || undefined,
      capacity: form.capacity ? parseInt(form.capacity) : undefined,
      featured: form.featured,
      status: form.status,
      ticketTiers: tiers
        .filter((t) => t.name && t.price && t.quantity)
        .map((t) => ({
          name: t.name,
          description: t.description || undefined,
          price: Math.round(parseFloat(t.price) * 100),
          quantity: parseInt(t.quantity),
        })),
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/events");
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ivory">Create Event</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Card variant="bordered">
          <h2 className="font-display text-lg font-bold text-ivory mb-4">Event Details</h2>
          <div className="space-y-4">
            <Input
              id="title"
              label="Title"
              placeholder="Event title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-mist">Description</label>
              <textarea
                className="w-full px-4 py-3 rounded-lg bg-charcoal border border-ash text-ivory placeholder:text-mist/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all min-h-[120px] resize-none"
                placeholder="Describe the event..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="date"
                label="Start Date & Time"
                type="datetime-local"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
              <Input
                id="endDate"
                label="End Date & Time"
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="venue"
                label="Venue"
                placeholder="Venue name"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                required
              />
              <Input
                id="address"
                label="Address"
                placeholder="Full address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="capacity"
                label="Capacity"
                type="number"
                placeholder="Max attendees"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-mist">Status</label>
                <select
                  className="w-full px-4 py-3 rounded-lg bg-charcoal border border-ash text-ivory focus:outline-none focus:ring-2 focus:ring-gold/30"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 rounded bg-charcoal border-ash text-gold focus:ring-gold/30"
              />
              <span className="text-sm text-mist">Featured event</span>
            </label>
          </div>
        </Card>

        {/* Ticket Tiers */}
        <Card variant="bordered">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-ivory">Ticket Tiers</h2>
            <Button type="button" variant="secondary" size="sm" onClick={addTier}>
              Add Tier
            </Button>
          </div>
          <div className="space-y-4">
            {tiers.map((tier, i) => (
              <div key={i} className="p-4 rounded-lg bg-obsidian/50 border border-ash/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-mist">Tier {i + 1}</span>
                  {tiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTier(i)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Tier name"
                    value={tier.name}
                    onChange={(e) => updateTier(i, "name", e.target.value)}
                  />
                  <Input
                    placeholder="Description"
                    value={tier.description}
                    onChange={(e) => updateTier(i, "description", e.target.value)}
                  />
                  <Input
                    placeholder="Price (EUR)"
                    type="number"
                    step="0.01"
                    value={tier.price}
                    onChange={(e) => updateTier(i, "price", e.target.value)}
                  />
                  <Input
                    placeholder="Quantity"
                    type="number"
                    value={tier.quantity}
                    onChange={(e) => updateTier(i, "quantity", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <div className="flex gap-4">
          <Button type="submit" variant="gold" size="lg" loading={loading}>
            Create Event
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
