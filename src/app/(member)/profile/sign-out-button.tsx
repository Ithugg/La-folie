"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/actions/auth";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    await signOutAction();
    router.push("/");
    router.refresh();
  }

  return (
    <Button
      variant="danger"
      onClick={handleSignOut}
      loading={loading}
      className="w-full"
    >
      Sign Out
    </Button>
  );
}
