"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination } from "@/types";

export function PaginationBar({ pagination, onPage }: { pagination: Pagination; onPage: (p: number) => void }) {
  const {
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  hasNextPage = false,
  hasPrevPage = false,
} = pagination || {};
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(total, page * limit);
  
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white">
      {/* Records Info */}
      <div className="text-sm font-medium text-slate-500 order-2 sm:order-1">
        Showing <span className="text-slate-800 font-semibold">{start}</span>–
        <span className="text-slate-800 font-semibold">{end}</span> of{" "}
        <span className="text-slate-800 font-semibold">{total}</span> records
      </div>
      
      {/* Navigation controls */}
      <div className="flex items-center gap-3 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-start">
        <Button 
          variant="outline" 
          size="sm" 
          disabled={!hasPrevPage} 
          onClick={() => onPage(page - 1)}
          className="h-9 rounded-xl border-slate-200 px-4 hover:bg-slate-50 text-slate-700 disabled:opacity-40 transition-all font-medium inline-flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>
        
        <div className="text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-100 px-3.5 py-1.5 rounded-xl min-w-[100px] text-center shadow-inner">
          Page {page} of {Math.max(1, totalPages)}
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          disabled={!hasNextPage} 
          onClick={() => onPage(page + 1)}
          className="h-9 rounded-xl border-slate-200 px-4 hover:bg-slate-50 text-slate-700 disabled:opacity-40 transition-all font-medium inline-flex items-center gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}