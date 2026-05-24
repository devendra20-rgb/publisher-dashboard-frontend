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
      try {
        const [pRes, sRes] = await Promise.all([
          fetchPublishers({ limit: 1000 }),
          fetchSheets(),
        ]);
        setPublishers(pRes?.publishers || []);
        setSheets(sRes || []);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const activeSheets = sheets.filter((s) => s.active).length;
  const currentYear = new Date().getFullYear();
  const currentMonthIdx = new Date().getMonth();

  const monthly = Array.from({ length: 12 }, (_, i) => {
    const monthDate = new Date(currentYear, i, 1);
    const month = monthDate.toLocaleString("default", { month: "short" });

    const count = publishers.filter((p) => {
      if (!p.contactDate) return false;
      const date = new Date(p.contactDate);
      return date.getMonth() === i && date.getFullYear() === currentYear;
    }).length;

    return { month, count };
  });

  const byPerson = Array.from(
    new Set(
      publishers
        .map((p) => p.usedBy?.trim())
        .filter((name): name is string => !!name)
    )
  )
    .map((name) => ({
      name,
      count: publishers.filter((p) => p.usedBy?.trim() === name).length,
    }))
    .sort((a, b) => b.count - a.count);

  const thisMonth = monthly[currentMonthIdx]?.count || 0;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8">
      {/* Consistent Header - Same as Publishers & Sheets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Dashboard
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Overview of publisher onboarding activity
          </p>
        </div>
      </div>

      {/* Stats Section */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Publishers"
            value={publishers.length}
            icon={Users}
            hint="Across all sheets"
            accent="primary"
          />
          <StatCard
            title="Active Sheets"
            value={`${activeSheets}/${sheets.length}`}
            icon={FileSpreadsheet}
            hint="Currently syncing"
            accent="green"
          />
          <StatCard
            title="This Month"
            value={thisMonth}
            icon={TrendingUp}
            hint="New onboardings"
            accent="violet"
          />
          <StatCard
            title="Delivery Team"
            value={byPerson.length}
            icon={UserCheck}
            hint="Active members"
            accent="amber"
          />
        </div>
      )}

      {/* Charts & Performance Section */}
      {!loading && (
        <div className="grid gap-4 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2">
            <MonthlyChart data={monthly} />
          </div>
          <PersonList data={byPerson} />
        </div>
      )}
    </div>
  );
}