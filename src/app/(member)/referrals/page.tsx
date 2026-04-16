"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createReferralCode, getUserReferrals } from "@/actions/referrals";

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    loadReferrals();
  }, []);

  async function loadReferrals() {
    setLoading(true);
    const result = await getUserReferrals();
    if (result.referrals) setReferrals(result.referrals);
    setLoading(false);
  }

  async function handleGenerate() {
    setGenerating(true);
    setError("");
    setNewCode("");

    const result = await createReferralCode();

    if (result.error) {
      setError(result.error);
    } else if (result.code) {
      setNewCode(result.code);
      loadReferrals();
    }
    setGenerating(false);
  }

  function copyLink(code: string) {
    const url = `${window.location.origin}/account?code=${code}`;
    navigator.clipboard.writeText(url);
    setCopied(code);
    setTimeout(() => setCopied(""), 2000);
  }

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-ivory">Referrals</h1>
          <p className="text-mist mt-2">
            Invite someone worthy. Each code grants one entry into La Folie.
          </p>
        </div>

        {/* Generate Section */}
        <Card variant="bordered" className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-medium text-ivory">Generate Invitation</h2>
              <p className="text-xs text-mist mt-1">
                Members can send 3 invites per week. Choose wisely.
              </p>
            </div>
            <Button
              variant="gold"
              onClick={handleGenerate}
              loading={generating}
            >
              Generate Code
            </Button>
          </div>

          {error && (
            <p className="text-sm text-red-400 mt-4">{error}</p>
          )}

          {newCode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl bg-gold/5 border border-gold/20"
            >
              <p className="text-xs text-gold mb-2">New invitation code generated!</p>
              <div className="flex items-center gap-3">
                <code className="flex-1 text-lg font-mono text-ivory bg-obsidian px-4 py-2 rounded-lg">
                  {newCode}
                </code>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => copyLink(newCode)}
                >
                  {copied === newCode ? "Copied!" : "Copy Link"}
                </Button>
              </div>
            </motion.div>
          )}
        </Card>

        {/* Referral History */}
        <div>
          <h2 className="font-display text-xl font-bold text-ivory mb-4">
            Your Invitations
          </h2>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full mx-auto" />
            </div>
          ) : referrals.length === 0 ? (
            <Card variant="bordered">
              <p className="text-center text-mist py-8">
                No invitations yet. Generate your first code above.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {referrals.map((ref) => (
                <Card key={ref.id} variant="bordered" padding="sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <code className="text-sm font-mono text-gold bg-gold/5 px-3 py-1 rounded">
                        {ref.code}
                      </code>
                      <div>
                        {ref.usages.length > 0 ? (
                          <p className="text-sm text-ivory">
                            Used by {ref.usages[0].referredUser.name}
                          </p>
                        ) : (
                          <p className="text-sm text-mist">Unused</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {ref.usedCount >= ref.maxUses ? (
                        <Badge variant="success">Used</Badge>
                      ) : !ref.isActive ? (
                        <Badge variant="danger">Expired</Badge>
                      ) : (
                        <>
                          <Badge variant="gold">Active</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyLink(ref.code)}
                          >
                            {copied === ref.code ? "Copied!" : "Copy"}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
