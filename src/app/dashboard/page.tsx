"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";

interface Summary {
  totalEvals: number;
  userAccuracy: number; // 0–1
  perLabelAccuracy: Record<string, number>; // e.g. { AA: 0.87, HC: 0.72, … }
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch(
      `/api/evaluations/summary?user=${encodeURIComponent(
        session.user?.email || ""
      )}`
    )
      .then((res) => res.json())
      .then(setSummary)
      .catch(console.error);
  }, [status, session?.user?.email]);

  if (status !== "authenticated" || !summary) {
    return (
      <p className="min-h-screen flex items-center justify-center">Loading…</p>
    );
  }

  const { totalEvals, userAccuracy, perLabelAccuracy } = summary;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8 max-w-4xl mx-auto space-y-8">
        <h2 className="text-2xl font-bold">Welcome, {session.user?.name}</h2>

        {/* Snapshot Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="text-center">
              <p className="text-lg">My Evaluations</p>
              <p className="text-3xl font-semibold">{totalEvals}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <p className="text-lg">Model's Accuracy</p>
              <p className="text-3xl font-semibold">
                {(userAccuracy * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
}
