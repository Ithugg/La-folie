"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime, formatPrice } from "@/lib/utils";
import { createCheckoutSession } from "@/actions/tickets";

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  endDate: string | null;
  venue: string;
  address: string | null;
  featured: boolean;
  capacity: number | null;
  ticketTiers: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    currency: string;
    quantity: number;
    sold: number;
  }[];
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState("");

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function handlePurchase(tierId: string) {
    setPurchasing(tierId);
    const result = await createCheckoutSession(event!.id, tierId, 1);
    if (result.url) {
      window.location.href = result.url;
    } else {
      alert(result.error || "Failed to create checkout session");
      setPurchasing("");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-mist">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-10">
            {event.featured && <Badge variant="gold" className="mb-3">Featured Event</Badge>}
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-ivory mb-4">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-mist">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(event.date)}
                {event.endDate && ` - ${formatTime(event.endDate)}`}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {event.venue}
              </span>
            </div>
          </div>

          {/* Description */}
          <Card variant="bordered" className="mb-8">
            <h2 className="font-display text-lg font-bold text-ivory mb-3">About This Event</h2>
            <p className="text-mist leading-relaxed whitespace-pre-wrap">{event.description}</p>
            {event.address && (
              <p className="text-sm text-mist/60 mt-4">
                <strong className="text-mist">Address:</strong> {event.address}
              </p>
            )}
          </Card>

          {/* Ticket Tiers */}
          <h2 className="font-display text-xl font-bold text-ivory mb-4">Select Tickets</h2>
          <div className="space-y-4">
            {event.ticketTiers.map((tier) => {
              const available = tier.quantity - tier.sold;
              const soldOut = available <= 0;

              return (
                <Card key={tier.id} variant="bordered" className={soldOut ? "opacity-50" : "hover:border-gold/20 transition-colors"}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-ivory text-lg">{tier.name}</h3>
                      {tier.description && (
                        <p className="text-sm text-mist mt-1">{tier.description}</p>
                      )}
                      <p className="text-xs text-mist/60 mt-2">
                        {soldOut ? "Sold out" : `${available} remaining`}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-2xl font-display font-bold text-gold">
                        {formatPrice(tier.price, tier.currency)}
                      </p>
                      <Button
                        variant="gold"
                        disabled={soldOut}
                        loading={purchasing === tier.id}
                        onClick={() => handlePurchase(tier.id)}
                      >
                        {soldOut ? "Sold Out" : "Buy Now"}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
