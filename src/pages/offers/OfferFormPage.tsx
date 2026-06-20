import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import api, { errorMessage } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../modals/ConfirmModal';
import type { ApiResponse, Offer, Paginated, Publisher } from '../../types';
import PaymentDetailsCard from './PaymentDetailsCard';

const schema = z.object({
  campaignName: z.string().trim().min(2),
  market: z.string().trim().min(1),
  kpi: z.string(),
  costingModel: z.string(),
  payout: z.coerce.number().min(0),
  note: z.string(),
  publisherId: z.string().min(1),
  status: z.string().trim().min(1),
  endDate: z.string().min(1)
});
type FormData = z.infer<typeof schema>;

export default function OfferFormPage() {
  const { id } = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const client = useQueryClient();
  const { user } = useAuth();
  const [pendingSave, setPendingSave] = useState<FormData | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { campaignName: '', market: '', kpi: '', costingModel: '', payout: 0, note: '', publisherId: search.get('publisherId') || '', status: '', endDate: '' }
  });

  const publishers = useQuery({
    queryKey: ['publishers', 'offer-select'],
    queryFn: async () => (await api.get<ApiResponse<Paginated<Publisher>>>('/publishers', { params: { limit: 100, sortBy: 'name', sortOrder: 'asc' } })).data.data.data
  });
  const offer = useQuery({
    queryKey: ['offer', id],
    enabled: Boolean(id),
    queryFn: async () => (await api.get<ApiResponse<Offer>>(`/offers/${id}`)).data.data
  });

  useEffect(() => {
    if (offer.data) reset({
      campaignName: offer.data.campaignName,
      market: offer.data.market,
      kpi: offer.data.kpi || '',
      costingModel: offer.data.costingModel || '',
      payout: offer.data.payout,
      note: offer.data.note || '',
      publisherId: offer.data.publisherId._id,
      status: offer.data.status,
      endDate: offer.data.endDate.slice(0, 10)
    });
  }, [offer.data, reset]);

  const save = useMutation({
    mutationFn: (values: FormData) => id ? api.put(`/offers/${id}`, values) : api.post('/offers', values),
    onSuccess: async () => {
      setPendingSave(null);
      await client.invalidateQueries({ queryKey: ['offers'] });
      await client.invalidateQueries({ queryKey: ['publisher-offers'] });
      await client.invalidateQueries({ queryKey: ['dashboard'] });
      navigate(id ? `/offers/${id}` : '/offers');
    }
  });

  const field = (label: string, name: keyof FormData, type = 'text') => <label><span className="label">{label}</span><input className="input" type={type} {...register(name)} /></label>;

  return <>
    <form onSubmit={handleSubmit(setPendingSave)}>
      <h2 className="page-title">{id ? 'Edit Offer' : 'Create Offer'}</h2>
      <p className="page-subtitle">Edit the Offer information. Payment details remain embedded in this Offer.</p>
      {(offer.error || save.error) && <div className="error-box my-5">{errorMessage(offer.error || save.error)}</div>}
      <section className="card mt-6">
        <h3 className="section-title">Offer Information</h3>
        <div className="form-grid">
          {field('Campaign Name *', 'campaignName')}
          <label><span className="label">Publisher *</span><select className="input" {...register('publisherId')}><option value="">Select publisher</option>{publishers.data?.map((publisher) => <option key={publisher._id} value={publisher._id}>{publisher.name}</option>)}</select></label>
          {field('Market *', 'market')}
          {field('KPI', 'kpi')}
          {field('Costing Model', 'costingModel')}
          {field('Payout *', 'payout', 'number')}
          {field('Status *', 'status')}
          {field('End Date *', 'endDate', 'date')}
          <label className="md:col-span-2"><span className="label">Note</span><textarea className="input min-h-24" {...register('note')} /></label>
        </div>
        {Object.keys(errors).length > 0 && <p className="error mt-3">Complete all required Offer fields.</p>}
      </section>
      <div className="mt-5 flex justify-end gap-3">
        <button type="button" className="btn-secondary" onClick={() => navigate(id ? `/offers/${id}` : '/offers')}>Cancel</button>
        <button className="btn-primary" disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save Offer'}</button>
      </div>
      <ConfirmModal open={Boolean(pendingSave)} title={id ? 'Update Offer?' : 'Create Offer?'} message={id ? 'Save these changes to the existing Offer?' : 'Create this Offer with the entered campaign information? Payment details will not be created.'} confirmLabel={id ? 'Update Offer' : 'Create Offer'} pending={save.isPending} onCancel={() => setPendingSave(null)} onConfirm={() => pendingSave && save.mutate(pendingSave)} />
    </form>

    {id && user?.role === 'admin' && offer.data && <PaymentDetailsCard offerId={offer.data._id} details={offer.data.paymentDetails} initialEditing />}
  </>;
}

