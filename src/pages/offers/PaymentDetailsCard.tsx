import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import api, { errorMessage } from '../../api/axios';
import ConfirmModal from '../../modals/ConfirmModal';
import type { PaymentDetails } from '../../types';

const schema = z.object({
  publisherName: z.string(),
  agencyPOC: z.string(),
  endDate: z.string(),
  validationDate: z.string(),
  invoiceDate: z.string(),
  paymentDate: z.string(),
  publisherConfirmation: z.string()
});
type FormData = z.infer<typeof schema>;
const toInputDate = (value?: string | null) => value ? value.slice(0, 10) : '';
const showDate = (value?: string | null) => value ? new Date(value).toLocaleDateString() : '—';

export default function PaymentDetailsCard({ offerId, details, initialEditing = false }: {
  offerId: string;
  details?: PaymentDetails;
  initialEditing?: boolean;
}) {
  const client = useQueryClient();
  const [editing, setEditing] = useState(initialEditing);
  const [pendingSave, setPendingSave] = useState<FormData | null>(null);
  const hasDetails = Boolean(details && Object.values(details).some((value) => value));
  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { publisherName: '', agencyPOC: '', endDate: '', validationDate: '', invoiceDate: '', paymentDate: '', publisherConfirmation: '' }
  });

  useEffect(() => {
    reset({
      publisherName: details?.publisherName || '',
      agencyPOC: details?.agencyPOC || '',
      endDate: toInputDate(details?.endDate),
      validationDate: toInputDate(details?.validationDate),
      invoiceDate: toInputDate(details?.invoiceDate),
      paymentDate: toInputDate(details?.paymentDate),
      publisherConfirmation: details?.publisherConfirmation || ''
    });
  }, [details, reset]);

  const save = useMutation({
    mutationFn: (values: FormData) => api.patch(`/offers/${offerId}/payment-details`, values),
    onSuccess: async () => {
      setPendingSave(null);
      setEditing(false);
      await client.invalidateQueries({ queryKey: ['offer', offerId] });
      await client.invalidateQueries({ queryKey: ['offers'] });
    }
  });

  return <section className="card mt-6 border-cyan-200">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h3 className="section-title">Payment Details (Admin Only)</h3><p className="text-xs text-slate-500">Payment information embedded in this Offer.</p></div>
      {!editing && <button type="button" className="btn-secondary" onClick={() => setEditing(true)}>{hasDetails ? 'Edit Payment Details' : 'Add Payment Details'}</button>}
    </div>

    {!editing && <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[
        ['Publisher Name', details?.publisherName || '—'],
        ['Agency POC', details?.agencyPOC || '—'],
        ['End Date', showDate(details?.endDate)],
        ['Validation Date', showDate(details?.validationDate)],
        ['Invoice Date', showDate(details?.invoiceDate)],
        ['Payment Date', showDate(details?.paymentDate)],
        ['Publisher Confirmation', details?.publisherConfirmation || '—']
      ].map(([label, value]) => <div key={label}><dt className="text-xs uppercase text-slate-500">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>)}
    </dl>}

    {editing && <form className="mt-5" onSubmit={handleSubmit(setPendingSave)}>
      {save.error && <div className="error-box mb-4">{errorMessage(save.error)}</div>}
      {save.isSuccess && <div className="success-box mb-4">Payment details saved successfully.</div>}
      <div className="form-grid">
        <label><span className="label">Publisher Name</span><input className="input" {...register('publisherName')} /></label>
        <label><span className="label">Agency POC</span><input className="input" {...register('agencyPOC')} /></label>
        <label><span className="label">End Date</span><input className="input" type="date" {...register('endDate')} /></label>
        <label><span className="label">Validation Date</span><input className="input" type="date" {...register('validationDate')} /></label>
        <label><span className="label">Invoice Date</span><input className="input" type="date" {...register('invoiceDate')} /></label>
        <label><span className="label">Payment Date</span><input className="input" type="date" {...register('paymentDate')} /></label>
        <label><span className="label">Publisher Confirmation</span><input className="input" {...register('publisherConfirmation')} /></label>
      </div>
      <div className="mt-5 flex gap-3"><button type="button" className="btn-secondary" onClick={() => { reset(); setEditing(false); }}>Cancel</button>
        <button className="btn-primary" disabled={save.isPending}>{save.isPending ? 'Saving…' : hasDetails ? 'Update Payment Details' : 'Add Payment Details'}</button></div>
    </form>}

    <ConfirmModal open={Boolean(pendingSave)} title={hasDetails ? 'Update Payment Details?' : 'Add Payment Details?'} message={hasDetails ? 'Save these payment changes to this Offer?' : 'Add this payment information to the same Offer?'} confirmLabel={hasDetails ? 'Update Payment Details' : 'Add Payment Details'} pending={save.isPending} onCancel={() => setPendingSave(null)} onConfirm={() => pendingSave && save.mutate(pendingSave)} />
  </section>;
}

