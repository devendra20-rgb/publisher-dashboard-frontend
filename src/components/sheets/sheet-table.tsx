"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Inbox, Trash2, Copy, Check } from "lucide-react";
import { useState } from "react";
import type { Sheet } from "@/types";

export function SheetTable({
  rows,
  loading,
  actionLoading,
  onToggleTarget,
  onDeleteTarget,
}: {
  rows: Sheet[];
  loading: boolean;
  actionLoading: boolean;
  onToggleTarget: (s: Sheet) => void;
  onDeleteTarget: (s: Sheet) => void;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full relative">
      <div className="max-h-[600px] overflow-auto relative">
        <Table className="w-full border-collapse">
          <TableHeader className="bg-slate-50/70 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-slate-700 h-12 px-6 text-sm">Sheet Name</TableHead>
              <TableHead className="font-semibold text-slate-700 h-12 px-6 text-sm">Used By</TableHead>
              <TableHead className="font-semibold text-slate-700 h-12 px-6 text-sm">Target Range</TableHead>
              <TableHead className="font-semibold text-slate-700 h-12 px-6 text-sm">Status</TableHead>
              <TableHead className="font-semibold text-slate-700 h-12 px-6 text-sm">Date Added</TableHead>
              <TableHead className="font-semibold text-slate-700 h-12 px-6 text-sm text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Loading Skeletons */}
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-b border-slate-100">
                  {Array.from({ length: 6 }).map((__, j) => (
                    <TableCell key={j} className="p-6">
                      <Skeleton 
                        className={`h-4 rounded-md bg-slate-100 ${
                          j === 0 ? "w-64" : 
                          j === 2 ? "w-32" : 
                          j === 5 ? "w-24 ml-auto" : "w-28"
                        }`} 
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {/* Empty State */}
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="p-0">
                  <div className="flex flex-col items-center justify-center py-24 text-center bg-white">
                    <div className="h-16 w-16 bg-slate-50 border border-slate-100 rounded-2xl inline-flex items-center justify-center text-slate-400 shadow-sm mb-5">
                      <Inbox className="h-8 w-8" />
                    </div>
                    <p className="font-semibold text-slate-800 text-lg">No sheets found</p>
                    <p className="text-sm text-slate-400 mt-2 max-w-md">
                      Add your first Google Sheet to start automating publisher tracking.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Data Rows */}
            {!loading &&
              rows.map((s) => (
                <TableRow 
                  key={s._id} 
                  className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Sheet Name + ID */}
                  <TableCell className="p-6">
                    <div className="font-semibold text-slate-900 group-hover:text-slate-950 text-[15px]">
                      {s.sheetName}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                      <span className="font-mono truncate max-w-[280px]">{s.sheetId}</span>
                      <button
                        onClick={() => copyToClipboard(s.sheetId)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded"
                      >
                        {copiedId === s.sheetId ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </TableCell>

                  {/* Used By */}
                  <TableCell className="p-6 text-sm font-medium text-slate-700">
                    {s.usedBy || "—"}
                  </TableCell>

                  {/* Target Range */}
                  <TableCell className="p-6">
                    <code className="inline-block bg-slate-100 text-slate-600 text-xs font-mono px-3 py-1 rounded border border-slate-200">
                      {s.range}
                    </code>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="p-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                      s.active 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}>
                      {s.active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>

                  {/* Date Added */}
                  <TableCell className="p-6 text-sm text-slate-600 whitespace-nowrap">
                    {s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-GB") : "—"}
                  </TableCell>

                  {/* Actions - Matching Screenshot Style */}
                  <TableCell className="p-6 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 font-medium">
                          {s.active ? "Active" : "Inactive"}
                        </span>
                        <Switch 
                          checked={s.active} 
                          onCheckedChange={() => onToggleTarget(s)}
                          disabled={actionLoading}
                          className="data-[state=checked]:bg-emerald-600 scale-90"
                        />
                      </div>

                      <button
                        onClick={() => onDeleteTarget(s)}
                        disabled={actionLoading}
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-all"
                        title="Delete Sheet"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}