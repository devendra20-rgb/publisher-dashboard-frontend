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
import { Inbox } from "lucide-react";
import type { Publisher } from "@/types";

// Standardizing color badges inside simple tailwind templates natively
function getStatusStyles(status: string) {
  const s = status.toLowerCase();
  if (s === "active" || s === "onboarded") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
  }
  if (s === "pending") {
    return "bg-amber-50 text-amber-700 border-amber-200/60";
  }
  if (s === "rejected") {
    return "bg-rose-50 text-rose-700 border-rose-200/60";
  }
  return "bg-slate-50 text-slate-600 border-slate-200/60";
}

export function PublisherTable({
  rows,
  loading,
}: {
  rows: Publisher[];
  loading: boolean;
}) {
  return (
    <div className="w-full relative">
      <div className="max-h-[600px] overflow-auto relative">
        <Table className="w-full border-collapse">
          <TableHeader className="bg-slate-50/70 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-slate-700 h-12 px-4 text-sm">Publisher</TableHead>
              <TableHead className="font-semibold text-slate-700 h-12 px-4 text-sm">Market</TableHead>
              <TableHead className="font-semibold text-slate-700 h-12 px-4 text-sm">Publisher POC</TableHead>
              <TableHead className="font-semibold text-slate-700 h-12 px-4 text-sm">Agency POC</TableHead>
              <TableHead className="font-semibold text-slate-700 h-12 px-4 text-sm">Contact Date</TableHead>
              <TableHead className="font-semibold text-slate-700 h-12 px-4 text-sm">Status</TableHead>
              <TableHead className="font-semibold text-slate-700 h-12 px-4 text-sm">Used By</TableHead>
              <TableHead className="font-semibold text-slate-700 h-12 px-4 text-sm">Notes</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {/* Loading Skeleton Logic */}
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i} className="border-b border-slate-100">
                  {Array.from({ length: 8 }).map((__, j) => (
                    <TableCell key={j} className="p-4">
                      <Skeleton 
                        className={`h-4 rounded-md bg-slate-100 ${
                          j === 0 ? "w-32" : j === 7 ? "w-full" : "w-20"
                        }`} 
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {/* Empty Records Logic */}
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="p-0">
                  <div className="flex flex-col items-center justify-center py-20 text-center bg-white">
                    <div className="h-14 w-14 bg-slate-50 border border-slate-100 rounded-2xl inline-flex items-center justify-center text-slate-400 shadow-sm mb-4">
                      <Inbox className="h-6 w-6" />
                    </div>
                    <p className="font-semibold text-slate-800 text-base">No records matched</p>
                    <p className="text-sm text-slate-400 mt-1 max-w-sm">
                      Try adjusting your selected filtering menus or trigger a manual synchronization.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Standard Rows Logic */}
            {!loading &&
              rows.map((r) => (
                <TableRow 
                  key={r._id} 
                  className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group"
                >
                  <TableCell className="font-semibold text-slate-900 p-4 text-sm group-hover:text-slate-950">
                    {r.publisherName}
                  </TableCell>
                  
                  <TableCell className="text-slate-600 p-4 text-sm font-medium">
                    {r.market || "—"}
                  </TableCell>
                  
                  <TableCell className="text-slate-600 p-4 text-sm">
                    {r.publisherPOC || "—"}
                  </TableCell>
                  
                  <TableCell className="text-slate-600 p-4 text-sm">
                    {r.agencyPOC || "—"}
                  </TableCell>
                  
                  <TableCell className="text-slate-500 p-4 text-xs font-medium whitespace-nowrap">
                    {r.contactDate
                      ? new Date(r.contactDate).toLocaleDateString("en-GB")
                      : "—"}
                  </TableCell>
                  
                  <TableCell className="p-4">
                    {r.status ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all ${getStatusStyles(r.status)}`}>
                        {r.status}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </TableCell>
                  
                  <TableCell className="text-slate-600 p-4 text-sm font-medium">
                    {r.usedBy || "—"}
                  </TableCell>
                  
                  <TableCell className="max-w-xs truncate text-slate-400 p-4 text-xs italic group-hover:text-slate-500 transition-colors">
                    {r.notes || "—"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}