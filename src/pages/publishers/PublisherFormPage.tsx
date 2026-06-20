import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import api, { errorMessage } from '../../api/axios';
import type { ApiResponse, Publisher } from '../../types';
import ConfirmModal from '../../modals/ConfirmModal';

const schema = z.object({
  name: z.string().trim().min(2), market: z.string().trim().min(1), poc: z.string().trim().min(1),
  status: z.string().trim().min(1), wishlist: z.string(), agencyPoc: z.string()
});
type FormData = z.infer<typeof schema>;
const empty: FormData = { name: '', market: '', poc: '', status: '', wishlist: '', agencyPoc: '' };

export default function PublisherFormPage() {
  const { id } = useParams(); const navigate = useNavigate(); const client = useQueryClient();
  const publisher = useQuery({
    queryKey: ['publisher', id], enabled: Boolean(id),
    queryFn: async () => (await api.get<ApiResponse<Publisher>>(`/publishers/${id}`)).data.data
  });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: empty });
  const [pendingSave, setPendingSave] = useState<FormData | null>(null);
  useEffect(() => { if (publisher.data) reset(publisher.data); }, [publisher.data, reset]);
  const save = useMutation({
    mutationFn: (values: FormData) => id ? api.put(`/publishers/${id}`, values) : api.post('/publishers', values),
    onSuccess: async () => { await client.invalidateQueries({ queryKey: ['publishers'] }); await client.invalidateQueries({ queryKey: ['dashboard'] }); navigate('/publishers'); }
  });
  const field = (label: string, name: keyof FormData) => <label><span className="label">{label}</span><input className="input" {...register(name)} /></label>;
  if (publisher.isLoading) return <p>Loading publisher…</p>;
  return <form onSubmit={handleSubmit(setPendingSave)}>
    <h2 className="page-title">{id ? 'Edit Publisher' : 'Create Publisher'}</h2>
    <p className="page-subtitle">Publisher information is managed independently from offers.</p>
    {(publisher.error || save.error) && <div className="error-box my-5">{errorMessage(publisher.error || save.error)}</div>}
    <section className="card mt-6"><div className="form-grid">{field('Name *', 'name')}{field('Market *', 'market')}{field('POC *', 'poc')}
      {field('Status *', 'status')}{field('Wishlist', 'wishlist')}{field('Agency POC', 'agencyPoc')}</div>
      {Object.keys(errors).length > 0 && <p className="error mt-3">Complete all required fields.</p>}</section>
    <div className="mt-5 flex justify-end gap-3"><button type="button" className="btn-secondary" onClick={() => navigate('/publishers')}>Cancel</button>
      <button className="btn-primary" disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save Publisher'}</button></div>
    <ConfirmModal open={Boolean(pendingSave)} title={id ? 'Update Publisher?' : 'Create Publisher?'} message={id ? 'Save these changes to this Publisher?' : 'Create this Publisher with the entered information?'} confirmLabel={id ? 'Update Publisher' : 'Create Publisher'} pending={save.isPending} onCancel={() => setPendingSave(null)} onConfirm={() => pendingSave && save.mutate(pendingSave)} />
  </form>;
}
