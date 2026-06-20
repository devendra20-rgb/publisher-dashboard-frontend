import { useEffect } from 'react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  pending?: boolean;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ open, title, message, confirmLabel, pending, danger, onConfirm, onCancel }: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape' && !pending) onCancel(); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open, pending, onCancel]);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title" onMouseDown={(event) => {
    if (event.target === event.currentTarget && !pending) onCancel();
  }}><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
    <h2 id="confirm-title" className="text-xl font-semibold text-slate-950">{title}</h2>
    <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
    <div className="mt-6 flex justify-end gap-3"><button type="button" className="btn-secondary" disabled={pending} onClick={onCancel}>Cancel</button>
      <button type="button" className={danger ? 'rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50' : 'btn-primary'} disabled={pending} onClick={onConfirm}>{pending ? 'Please wait…' : confirmLabel}</button></div>
  </div></div>;
}
