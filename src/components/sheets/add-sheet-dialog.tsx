"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Loader2, Sparkles } from "lucide-react";
import { createSheet } from "@/lib/api";
import type { Sheet } from "@/types";

interface AddSheetDialogProps {
  onCreated: (s: Sheet) => void;
}

export function AddSheetDialog({ onCreated }: AddSheetDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ 
    sheetName: "", 
    sheetId: "", 
    usedBy: "", 
    range: "Sheet1!A:G", 
    active: true 
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const s = await createSheet(form);
      if (s) {
        onCreated(s);
        setOpen(false);
        setForm({ sheetName: "", sheetId: "", usedBy: "", range: "Sheet1!A:G", active: true });
      }
    } catch (err) {
      console.error("Failed to map dynamic config schema stream:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-medium tracking-tight shadow-sm hover:opacity-95 transition-all gap-2">
          <Plus className="h-4 w-4" />
          Add Sheet Source
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px] rounded-xl shadow-2xl border border-muted bg-background">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Connect Google Sheet
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            Link and map real-time workbook arrays to monitor onboarding pipelines.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4 pt-3.5">
          <div className="space-y-1.5">
            <Label htmlFor="sheetName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Alias Name
            </Label>
            <Input 
              id="sheetName" 
              required 
              value={form.sheetName} 
              onChange={(e) => setForm({ ...form, sheetName: e.target.value })} 
              placeholder="e.g., Publisher Beta Stream" 
              className="rounded-lg border-muted focus-visible:ring-primary h-10"
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="sheetId" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Spreadsheet ID Hash
            </Label>
            <Input 
              id="sheetId" 
              required 
              value={form.sheetId} 
              onChange={(e) => setForm({ ...form, sheetId: e.target.value })} 
              placeholder="Extract from spreadsheet URL" 
              className="rounded-lg border-muted focus-visible:ring-primary h-10 font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="usedBy" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Auditor Handle
              </Label>
              <Input 
                id="usedBy" 
                required 
                value={form.usedBy} 
                onChange={(e) => setForm({ ...form, usedBy: e.target.value })} 
                placeholder="Manager alias" 
                className="rounded-lg border-muted focus-visible:ring-primary h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="range" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Target Range
              </Label>
              <Input 
                id="range" 
                required
                value={form.range} 
                onChange={(e) => setForm({ ...form, range: e.target.value })} 
                placeholder="Sheet1!A:G"
                className="rounded-lg border-muted focus-visible:ring-primary h-10 font-mono text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border p-4 bg-muted/30 shadow-inner mt-2">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold text-foreground">Immediate Synchronization</Label>
              <p className="text-xs text-muted-foreground max-w-[240px] leading-normal">
                Trigger active background ingest workers immediately on creation.
              </p>
            </div>
            <Switch 
              checked={form.active} 
              onCheckedChange={(v) => setForm({ ...form, active: v })} 
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>

          <DialogFooter className="gap-2 pt-3 border-t mt-4 flex-col sm:flex-row">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-lg h-10 font-medium">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="rounded-lg h-10 font-medium px-5">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Mapping Schema...
                </>
              ) : (
                "Add Pipeline Source"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}