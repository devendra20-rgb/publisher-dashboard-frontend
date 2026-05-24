"use client";

import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import {
  fetchPublisherDetails,
  manualSyncPublisherDetails,
} from "@/lib/api";

import {
  PublisherDetailsFilters,
} from "@/components/publisher-details/publisher-details-filters";

import {
  PublisherDetailsTable,
} from "@/components/publisher-details/publisher-details-table";

import {
  PaginationBar,
} from "@/components/publishers/pagination";

import { Button } from "@/components/ui/button";

export default function PublisherDetailsPage() {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [page, setPage] = useState(1);

  const [details, setDetails] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [filters, setFilters] = useState({
    publisherName: "",
    pubId: "",
    market: "",
    campaignWishlist: "",
    campaignType: "",
    mmpTrackingTool: "",
  });

  // Load Data
  useEffect(() => {
    loadData();
  }, [filters, page]);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetchPublisherDetails({
        ...filters,
        page,
        limit: 10,
      });

      setDetails(res.publisherDetails || []);
      setPagination(
        res.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load publisher details");
    } finally {
      setLoading(false);
    }
  }

  // Manual Sync
  async function handleSync() {
    try {
      setSyncing(true);
      await manualSyncPublisherDetails();
      await loadData();
      toast.success("Publisher details synced successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to sync publisher details");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8">
      {/* Header - Same as Publishers Page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Publisher Details
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Campaign and MMP tracking details synced from Google Sheets
          </p>
        </div>

        {/* Manual Sync Button */}
        <Button
          onClick={handleSync}
          disabled={syncing}
          className="sm:w-auto w-full inline-flex items-center justify-center gap-2 px-5 h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm transition-all active:scale-[0.98]"
        >
          <RefreshCcw className={`h-4 w-4 transition-transform ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Manual Sync"}
        </Button>
      </div>

      {/* Filters */}
      <div className="w-full">
        <PublisherDetailsFilters
          filters={filters}
          setFilters={(value: any) => {
            setPage(1);
            setFilters(value);
          }}
        />
      </div>

      {/* Table Container - Exact same as Publishers Page */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-2 md:p-4 space-y-6">
        <div className="overflow-x-auto rounded-xl">
          <PublisherDetailsTable
            data={details}
            loading={loading}
          />
        </div>

        {/* Pagination */}
        {!loading && pagination.total > 0 && (
          <div className="border-t border-slate-100 pt-4 px-2">
            <PaginationBar
              pagination={pagination}
              onPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}