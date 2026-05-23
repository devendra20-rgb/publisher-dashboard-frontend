"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { createSheet } from "@/lib/api";
import type { Sheet } from "@/types";

export function AddSheetDialog({ onCreated }: { onCreated: (s: Sheet) => void }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ sheetName: "", sheetId: "", usedBy: "", range: "Sheet1!A:G", active: true });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const s = await createSheet(form);
    setSubmitting(false);
    if (s) {
      onCreated(s);
      setOpen(false);
      setForm({ sheetName: "", sheetId: "", usedBy: "", range: "Sheet1!A:G", active: true });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4" />Add Sheet</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new sheet</DialogTitle>
          <DialogDescription>Connect a new Google Sheet for publisher onboarding tracking.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sheetName">Sheet Name</Label>
            <Input id="sheetName" required value={form.sheetName} onChange={(e) => setForm({ ...form, sheetName: e.target.value })} placeholder="e.g. Sagar Sheet" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sheetId">Sheet ID</Label>
            <Input id="sheetId" required value={form.sheetId} onChange={(e) => setForm({ ...form, sheetId: e.target.value })} placeholder="Google Sheet ID" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="usedBy">Used By</Label>
              <Input id="usedBy" required value={form.usedBy} onChange={(e) => setForm({ ...form, usedBy: e.target.value })} placeholder="Delivery person" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="range">Range</Label>
              <Input id="range" value={form.range} onChange={(e) => setForm({ ...form, range: e.target.value })} />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div><Label>Active</Label><p className="text-xs text-muted-foreground">Sync data from this sheet</p></div>
            <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "Adding…" : "Add Sheet"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
