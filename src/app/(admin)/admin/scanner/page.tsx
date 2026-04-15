"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { scanTicket } from "@/actions/admin";
import { formatDate } from "@/lib/utils";

export default function ScannerPage() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) return;

    setLoading(true);
    setResult(null);

    const res = await scanTicket(token.trim());
    setResult(res);
    setLoading(false);
  }

  function reset() {
    setToken("");
    setResult(null);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ivory">Ticket Scanner</h1>
        <p className="text-mist mt-1">Scan or enter ticket tokens to validate entry</p>
      </div>

      <div className="max-w-md mx-auto">
        {/* Scan Form */}
        <Card variant="bordered" className="mb-6">
          <form onSubmit={handleScan} className="space-y-4">
            <Input
              id="token"
              label="Ticket Token"
              placeholder="TKT-XXXXXXXXXX"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="font-mono text-center text-lg"
              autoFocus
            />
            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              loading={loading}
            >
              Validate Ticket
            </Button>
          </form>
        </Card>

        {/* Result */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card
                variant="bordered"
                className={
                  result.valid
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-red-500/30 bg-red-500/5"
                }
              >
                {/* Status Icon */}
                <div className="text-center mb-4">
                  {result.valid ? (
                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                      <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                      <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="text-center mb-4">
                  <h2 className={`text-2xl font-display font-bold ${result.valid ? "text-green-400" : "text-red-400"}`}>
                    {result.valid ? "ENTRY GRANTED" : "ENTRY DENIED"}
                  </h2>
                  {result.error && (
                    <p className="text-sm text-red-400 mt-1">{result.error}</p>
                  )}
                </div>

                {result.ticket && (
                  <div className="space-y-2 border-t border-ash/30 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-mist">Guest</span>
                      <span className="text-ivory font-medium">{result.ticket.user.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-mist">Event</span>
                      <span className="text-ivory font-medium">{result.ticket.event.title}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-mist">Tier</span>
                      <Badge variant="gold">{result.ticket.ticketTier.name}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-mist">Date</span>
                      <span className="text-ivory">{formatDate(result.ticket.event.date)}</span>
                    </div>
                  </div>
                )}

                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full mt-4"
                  onClick={reset}
                >
                  Scan Next Ticket
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
