"use client";

import { useEffect, useMemo, useState } from "react";
// import { Toaster } from "sonner";
import { toast } from "sonner";

import {
  PublisherFilters,
  type FiltersState,
} from "@/components/publishers/filters";

import { PublisherTable } from "@/components/publishers/table";

import { PaginationBar } from "@/components/publishers/pagination";

import { fetchPublishers, fetchSheets, API_BASE } from "@/lib/api";

import type { PublisherResponse } from "@/types";

import { Button } from "@/components/ui/button";

import { RefreshCcw } from "lucide-react";

export default function PublishersPage() {
  // Filters
  const [filters, setFilters] = useState<FiltersState>({
    publisherName: "",
    usedBy: "",
    market: "",
    status: "",
    startDate: "",
    endDate: "",
    range: "",
  });

  // Pagination
  const [page, setPage] = useState(1);

  // API Data
  const [data, setData] = useState<PublisherResponse | null>(null);

  // Loading
  const [loading, setLoading] = useState(true);

  // Sync loading
  const [syncing, setSyncing] = useState(false);

  // Debounced filters
  const [debounced, setDebounced] = useState(filters);

  // Dynamic people from sheets API
  const [people, setPeople] = useState<string[]>([]);

  // ─────────────────────────────────────────────
  // Debounce filters
  // ─────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(filters);
    }, 300);

    return () => clearTimeout(t);
  }, [filters]);

  // ─────────────────────────────────────────────
  // Reset page on filter change
  // ─────────────────────────────────────────────
  useEffect(() => {
    setPage(1);
  }, [debounced]);

  // ─────────────────────────────────────────────
  // Fetch publishers
  // ─────────────────────────────────────────────
  const loadPublishers = async () => {
    setLoading(true);

    try {
      const res = await fetchPublishers({
        ...debounced,

        startDate:
          debounced.range === "custom" ? debounced.startDate : undefined,

        endDate: debounced.range === "custom" ? debounced.endDate : undefined,

        page,
        limit: 10,
      });

      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublishers();
  }, [debounced, page]);

  // ─────────────────────────────────────────────
  // Fetch sheets → usedBy dropdown
  // ─────────────────────────────────────────────
  useEffect(() => {
    fetchPublishers({
      page: 1,
      limit: 1000,
    }).then((res) => {
      const uniquePeople = [
        ...new Set<string>(
          (res.publishers || [])
            .map((p) => p.agencyPOC)
            .filter(Boolean)
        ),
      ];

      setPeople(uniquePeople);
    });
  }, []);

  // ─────────────────────────────────────────────
  // Manual Sync
  // ─────────────────────────────────────────────
  const handleManualSync = async () => {
    try {
      setSyncing(true);

      const response = await fetch(`${API_BASE}/sync`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Sync failed");
      }

      await loadPublishers();

      toast.success("Sheets synced successfully");
    } catch (error) {
      console.error(error);

      toast.error("Failed to sync sheets");
    } finally {
      setSyncing(false);
    }
  };

  // ─────────────────────────────────────────────
  // Dynamic markets
  // ─────────────────────────────────────────────
  const markets = useMemo(() => {
    return [
      ...new Set<string>(
        (data?.publishers || []).map((p) => p.market).filter(Boolean),
      ),
    ];
  }, [data]);

  // ─────────────────────────────────────────────
  // Dynamic statuses
  // ─────────────────────────────────────────────
  const statuses = useMemo(() => {
    return [
      ...new Set<string>(
        (data?.publishers || []).map((p) => p.status).filter(Boolean),
      ),
    ];
  }, [data]);

  // ─────────────────────────────────────────────
  // Pagination fallback
  // ─────────────────────────────────────────────
  const pagination = useMemo(
    () =>
      data?.pagination ?? {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    [data],
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8">
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Publishers
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            All onboarding records from connected sheets
          </p>
        </div>

        {/* Manual Sync Button */}
        <Button 
          onClick={handleManualSync} 
          disabled={syncing} 
          className="sm:w-auto w-full inline-flex items-center justify-center gap-2 px-5 h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm transition-all active:scale-[0.98]"
        >
          <RefreshCcw className={`h-4 w-4 transition-transform ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing Database..." : "Manual Sync"}
        </Button>
      </div>

      {/* Filters Wrapper */}
      <div className="w-full">
        <PublisherFilters
          value={filters}
          onChange={setFilters}
          people={people}
          markets={markets}
          statuses={statuses}
        />
      </div>

      {/* Table & Pagination Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-2 md:p-4 space-y-6">
        <div className="overflow-x-auto rounded-xl">
          <PublisherTable rows={data?.publishers ?? []} loading={loading} />
        </div>

        <div className="border-t border-slate-100 pt-4 px-2">
          <PaginationBar pagination={pagination} onPage={setPage} />
        </div>
      </div>
    </div>
  );
}