"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Inbox } from "lucide-react";
import type { Publisher } from "@/types";

function statusVariant(status: string) {
  const s = status.toLowerCase();
  if (s === "active" || s === "onboarded") return "success" as const;
  if (s === "pending") return "warning" as const;
  if (s === "rejected") return "destructive" as const;
  return "secondary" as const;
}

export function PublisherTable({
  rows,
  loading,
}: {
  rows: Publisher[];
  loading: boolean;
}) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="max-h-[640px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Publisher</TableHead>
              <TableHead>Market</TableHead>
              <TableHead>Publisher POC</TableHead>
              <TableHead>Agency POC</TableHead>
              <TableHead>Contact Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Used By</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Inbox className="h-10 w-10 mb-3" />
                    <p className="font-medium">No publishers found</p>
                    <p className="text-sm">
                      Try adjusting your filters or add a new sheet.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              rows.map((r) => (
                <TableRow key={r._id}>
                  <TableCell className="font-medium">
                    {r.publisherName}
                  </TableCell>
                  <TableCell>{r.market || "—"}</TableCell>
                  <TableCell>{r.publisherPOC || "—"}</TableCell>
                  <TableCell>{r.agencyPOC || "—"}</TableCell>
                  <TableCell>
                    {r.contactDate
                      ? new Date(r.contactDate).toLocaleDateString("en-GB")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(r.status)}>
                      {r.status || "—"}
                    </Badge>
                  </TableCell>
                  <TableCell>{r.usedBy}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
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
