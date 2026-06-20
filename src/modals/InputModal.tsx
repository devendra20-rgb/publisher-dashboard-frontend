interface InputModalProps {
  open: boolean;
  title: string;
  message: string;
  label: string;
  value: string;
  type?: string;
  error?: string;
  pending?: boolean;
  confirmLabel: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function InputModal({ open, title, message, label, value, type = 'text', error, pending, confirmLabel, onChange, onConfirm, onCancel }: InputModalProps) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4" role="dialog" aria-modal="true"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
    <h2 className="text-xl font-semibold text-slate-950">{title}</h2><p className="mt-2 text-sm text-slate-600">{message}</p>
    <label className="mt-5 block"><span className="label">{label}</span><input autoFocus className="input" type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label>
    {error && <p className="error mt-2">{error}</p>}<div className="mt-6 flex justify-end gap-3"><button type="button" className="btn-secondary" disabled={pending} onClick={onCancel}>Cancel</button>
      <button type="button" className="btn-primary" disabled={pending || !value} onClick={onConfirm}>{pending ? 'Please wait…' : confirmLabel}</button></div>
  </div></div>;
}
