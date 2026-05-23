"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { FileSpreadsheet } from "lucide-react";
import { AddSheetDialog } from "@/components/sheets/add-sheet-dialog";
import { fetchSheets, toggleSheet } from "@/lib/api";
import type { Sheet } from "@/types";

function fmtDate(d: string) { try { return new Date(d).toLocaleDateString(); } catch { return d; } }

export default function SheetsPage() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSheets().then((s) => { setSheets(s); setLoading(false); }); }, []);

  async function onToggle(id: string) {
    const updated = await toggleSheet(id);
    if (updated) setSheets((prev) => prev.map((s) => (s._id === id ? updated : s)));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sheet Management</h1>
          <p className="text-sm text-muted-foreground">Manage Google Sheets connected to the dashboard</p>
        </div>
        <AddSheetDialog onCreated={(s) => setSheets((p) => [s, ...p])} />
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : sheets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <FileSpreadsheet className="h-10 w-10 mb-3" />
              <p className="font-medium">No sheets yet</p>
              <p className="text-sm">Add your first Google Sheet to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sheet Name</TableHead>
                  <TableHead>Used By</TableHead>
                  <TableHead>Range</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sheets.map((s) => (
                  <TableRow key={s._id}>
                    <TableCell>
                      <div className="font-medium">{s.sheetName}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[260px]">{s.sheetId}</div>
                    </TableCell>
                    <TableCell>{s.usedBy}</TableCell>
                    <TableCell><code className="text-xs">{s.range}</code></TableCell>
                    <TableCell>
                      {s.active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{fmtDate(s.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Switch checked={s.active} onCheckedChange={() => onToggle(s._id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
