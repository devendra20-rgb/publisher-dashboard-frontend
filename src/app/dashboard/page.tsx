"use client";
import { useEffect, useState } from "react";
import { Users, FileSpreadsheet, TrendingUp, UserCheck } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { MonthlyChart } from "@/components/dashboard/monthly-chart";
import { PersonList } from "@/components/dashboard/person-list";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPublishers, fetchSheets } from "@/lib/api";
import type { Publisher, Sheet } from "@/types";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [sheets, setSheets] = useState<Sheet[]>([]);

  useEffect(() => {
    (async () => {
      const [pRes, sRes] = await Promise.all([fetchPublishers({ limit: 1000 }), fetchSheets()]);
      setPublishers(pRes.publishers); setSheets(sRes); setLoading(false);
    })();
  }, []);

  const activeSheets = sheets.filter((s) => s.active).length;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const monthly = months.map((m, i) => ({
    month: m,
    count: publishers.filter((p) => {
      const d = p.contactDate.split("/");
      return d[1] === String(i + 1).padStart(2, "0");
    }).length,
  }));
  const byPerson = Array.from(new Set(publishers.map((p) => p.usedBy))).map((name) => ({
    name, count: publishers.filter((p) => p.usedBy === name).length,
  })).sort((a, b) => b.count - a.count);

  const currentMonth = new Date().getMonth();
  const thisMonth = monthly[currentMonth]?.count ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of publisher onboarding activity</p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Publishers" value={publishers.length} icon={Users} hint="Across all sheets" accent="primary" />
          <StatCard title="Active Sheets" value={`${activeSheets}/${sheets.length}`} icon={FileSpreadsheet} hint="Currently syncing" accent="green" />
          <StatCard title="This Month" value={thisMonth} icon={TrendingUp} hint="New onboardings" accent="violet" />
          <StatCard title="Delivery Team" value={byPerson.length} icon={UserCheck} hint="Active members" accent="amber" />
        </div>
      )}

      {!loading && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2"><MonthlyChart data={monthly} /></div>
          <PersonList data={byPerson} />
        </div>
      )}
    </div>
  );
}
