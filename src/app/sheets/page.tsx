"use client";

import { useEffect, useState } from "react";
import { AddSheetDialog } from "@/components/sheets/add-sheet-dialog";
import { SheetTable } from "@/components/sheets/sheet-table";
import { SheetModals } from "@/components/sheets/sheet-modals";
import { fetchSheets, toggleSheet, deleteSheet } from "@/lib/api";
import type { Sheet } from "@/types";

import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

export default function SheetsPage() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Modal actions
  const [toggleTarget, setToggleTarget] = useState<Sheet | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Sheet | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch Sheets
  useEffect(() => {
    fetchSheets().then((s) => {
      setSheets(s || []);
      setLoading(false);
    });
  }, []);

  // Manual Sync Function
  const handleManualSync = async () => {
    try {
      setSyncing(true);
      // Call your sync API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Sync failed");

      const freshSheets = await fetchSheets();
      setSheets(freshSheets || []);

      toast.success("Sheets synced successfully");
    } catch (error) {
      toast.error("Failed to sync sheets");
    } finally {
      setSyncing(false);
    }
  };

  async function handleToggleConfirm() {
    if (!toggleTarget) return;
    setActionLoading(true);
    const updated = await toggleSheet(toggleTarget._id);
    if (updated) {
      setSheets((prev) =>
        prev.map((s) => (s._id === toggleTarget._id ? updated : s))
      );
    }
    setActionLoading(false);
    setToggleTarget(null);
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setActionLoading(true);
    const success = await deleteSheet(deleteTarget._id);
    if (success) {
      setSheets((prev) => prev.filter((s) => s._id !== deleteTarget._id));
    }
    setActionLoading(false);
    setDeleteTarget(null);
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8">
      {/* Header Section - Same as Publishers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Sheet Management
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Configure automated sheet pipelines for tracker updates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleManualSync}
            disabled={syncing}
            variant="outline"
            className="inline-flex items-center gap-2 px-5 h-11 rounded-xl"
          >
            <RefreshCcw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Manual Sync"}
          </Button>

          <AddSheetDialog onCreated={(s) => setSheets((p) => [s, ...p])} />
        </div>
      </div>

      {/* Table Container - Matching Publishers Design */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-2 md:p-4">
        <div className="overflow-x-auto rounded-xl">
          <SheetTable
            rows={sheets}
            loading={loading}
            actionLoading={actionLoading}
            onToggleTarget={setToggleTarget}
            onDeleteTarget={setDeleteTarget}
          />
        </div>
      </div>

      {/* Modals */}
      <SheetModals
        toggleTarget={toggleTarget}
        deleteTarget={deleteTarget}
        actionLoading={actionLoading}
        onCloseToggle={() => setToggleTarget(null)}
        onCloseDelete={() => setDeleteTarget(null)}
        onConfirmToggle={handleToggleConfirm}
        onConfirmDelete={handleDeleteConfirm}
      />
    </div>
  );
}