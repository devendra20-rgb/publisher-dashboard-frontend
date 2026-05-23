"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination } from "@/types";

export function PaginationBar({ pagination, onPage }: { pagination: Pagination; onPage: (p: number) => void }) {
  const { page, totalPages, total, limit, hasNextPage, hasPrevPage } = pagination;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(total, page * limit);
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t bg-card rounded-b-lg">
      <div className="text-sm text-muted-foreground">Showing {start}–{end} of {total}</div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={!hasPrevPage} onClick={() => onPage(page - 1)}>
          <ChevronLeft className="h-4 w-4" />Prev
        </Button>
        <div className="text-sm font-medium px-2">Page {page} of {Math.max(1, totalPages)}</div>
        <Button variant="outline" size="sm" disabled={!hasNextPage} onClick={() => onPage(page + 1)}>
          Next<ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
