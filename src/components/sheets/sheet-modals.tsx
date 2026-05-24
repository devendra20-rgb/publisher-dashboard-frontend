"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import type { Sheet } from "@/types";

interface SheetModalsProps {
  toggleTarget: Sheet | null;
  deleteTarget: Sheet | null;
  actionLoading: boolean;
  onCloseToggle: () => void;
  onCloseDelete: () => void;
  onConfirmToggle: () => void;
  onConfirmDelete: () => void;
}

export function SheetModals({
  toggleTarget,
  deleteTarget,
  actionLoading,
  onCloseToggle,
  onCloseDelete,
  onConfirmToggle,
  onConfirmDelete,
}: SheetModalsProps) {
  return (
    <>
      {/* Alert Activation Modal */}
      <AlertDialog open={toggleTarget !== null} onOpenChange={(open) => !open && onCloseToggle()}>
        <AlertDialogContent className="max-w-[390px] rounded-xl border border-slate-200 shadow-xl p-5 bg-white">
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="text-lg font-bold tracking-tight flex items-center gap-2 text-slate-900">
              {actionLoading && <Loader2 className="h-4 w-4 animate-spin text-slate-600" />}
              {toggleTarget?.active ? "Deactivate Sheet Stream?" : "Activate Sheet Stream?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-500 leading-normal">
              {toggleTarget?.active
                ? `This pauses real-time database ingest sequences from "${toggleTarget.sheetName}".`
                : `This resumes automatic data loop sync pipelines for "${toggleTarget?.sheetName}".`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-5 gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-lg font-medium text-xs h-9 border border-slate-200 hover:bg-slate-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                onConfirmToggle();
              }}
              disabled={actionLoading}
              className={`rounded-lg font-medium text-xs h-9 text-white shadow-none ${
                toggleTarget?.active 
                  ? "bg-amber-600 hover:bg-amber-700" 
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {actionLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1.5 inline" /> : null}
              Confirm Action
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Destructive Deletion Warning Alert */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && onCloseDelete()}>
        <AlertDialogContent className="max-w-[390px] rounded-xl border border-rose-100 shadow-2xl p-5 bg-white">
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="text-lg font-bold tracking-tight text-rose-600">
              Disconnect Source?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-500 leading-normal">
              Are you sure you want to completely erase <strong className="text-slate-900 font-semibold">"{deleteTarget?.sheetName}"</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-5 gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-lg font-medium text-xs h-9 border border-slate-200 hover:bg-slate-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                onConfirmDelete();
              }}
              disabled={actionLoading}
              className="rounded-lg bg-rose-600 text-white hover:bg-rose-700 font-medium text-xs h-9 shadow-none"
            >
              {actionLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1.5 inline" /> : null}
              Delete Map
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}