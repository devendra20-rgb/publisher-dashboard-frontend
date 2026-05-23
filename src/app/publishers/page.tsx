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
    fetchSheets().then((sheets) => {
      const uniquePeople = [
        ...new Set<string>(sheets.map((s) => s.usedBy).filter(Boolean)),
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Publishers</h1>

          <p className="text-sm text-muted-foreground">
            All onboarding records from connected sheets
          </p>
        </div>

        {/* Manual Sync Button */}
        <Button onClick={handleManualSync} disabled={syncing} className="gap-2">
          <RefreshCcw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />

          {syncing ? "Syncing..." : "Manual Sync"}
        </Button>
      </div>

      {/* Filters */}
      <PublisherFilters
        value={filters}
        onChange={setFilters}
        people={people}
        markets={markets}
        statuses={statuses}
      />

      {/* Table */}
      <div className="space-y-4">
        <PublisherTable rows={data?.publishers ?? []} loading={loading} />

        <PaginationBar pagination={pagination} onPage={setPage} />
      </div>
    </div>
  );
}
