"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/actions/tickets";

interface Props {
  eventId: string;
  tierId: string;
  isAuthed: boolean;
  soldOut: boolean;
  redirectPath: string;
}

export function TicketPurchaseButton({
  eventId,
  tierId,
  isAuthed,
  soldOut,
  redirectPath,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!isAuthed) {
      router.push(
        `/account?redirect=${encodeURIComponent(redirectPath)}`
      );
      return;
    }
    setLoading(true);
    const result = await createCheckoutSession(eventId, tierId, 1);
    if (result?.url) {
      window.location.href = result.url;
    } else {
      alert(result?.error || "Failed to create checkout session");
      setLoading(false);
    }
  }

  return (
    <Button
      variant="gold"
      disabled={soldOut}
      loading={loading}
      onClick={handleClick}
    >
      {soldOut ? "Sold Out" : isAuthed ? "Buy Now" : "Sign In to Buy"}
    </Button>
  );
}
