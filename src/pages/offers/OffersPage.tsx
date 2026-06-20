import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api, { errorMessage } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../modals/ConfirmModal';
import type { ApiResponse, Offer, Paginated, Publisher } from '../../types';

export default function OffersPage() {
  const { user } = useAuth(); const client = useQueryClient(); const [params] = useSearchParams(); const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: '', market: '', status: '', publisherId: params.get('publisherId') || '' });
  const [pendingDelete, setPendingDelete] = useState<Offer | null>(null);
  const offers = useQuery({ queryKey: ['offers', page, filters], queryFn: async () =>
    (await api.get<ApiResponse<Paginated<Offer>>>('/offers', { params: { page, ...filters } })).data.data });
  const publishers = useQuery({ queryKey: ['publishers', 'offer-filter'], queryFn: async () =>
    (await api.get<ApiResponse<Paginated<Publisher>>>('/publishers', { params: { limit: 100 } })).data.data.data });
  const remove = useMutation({ mutationFn: (id: string) => api.delete(`/offers/${id}`), onSuccess: () => { setPendingDelete(null); client.invalidateQueries({ queryKey: ['offers'] }); } });
  const filter = (key: string, value: string) => { setPage(1); setFilters((old) => ({ ...old, [key]: value })); };
  return <div><div className="mb-6 flex justify-between gap-4"><div><h2 className="page-title">Offers</h2><p className="page-subtitle">Campaigns linked to Publishers.</p></div><Link className="btn-primary self-start" to="/offers/new">Create Offer</Link></div>
    <div className="card mb-5 grid gap-3 md:grid-cols-4"><input className="input" placeholder="Search campaign, KPI…" onChange={(e) => filter('search', e.target.value)} />
      <select className="input" value={filters.publisherId} onChange={(e) => filter('publisherId', e.target.value)}><option value="">All publishers</option>{publishers.data?.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}</select>
      <input className="input" placeholder="Market" onChange={(e) => filter('market', e.target.value)} /><input className="input" placeholder="Status" onChange={(e) => filter('status', e.target.value)} /></div>
    {(offers.error || remove.error) && <div className="error-box mb-4">{errorMessage(offers.error || remove.error)}</div>}
    {offers.isLoading ? <p>Loading offers…</p> : <div className="overflow-x-auto rounded-xl border bg-white"><table className="table"><thead><tr><th>Campaign</th><th>Publisher</th><th>Market</th><th>Payout</th><th>Status</th><th>End Date</th><th>Actions</th></tr></thead>
      <tbody>{offers.data?.data.map((o) => <tr key={o._id}><td className="font-medium"><Link className="text-link" to={`/offers/${o._id}`}>{o.campaignName}</Link></td><td>{o.publisherId?.name}</td><td>{o.market}</td><td>{o.payout}</td><td><span className="badge">{o.status}</span></td><td>{new Date(o.endDate).toLocaleDateString()}</td>
        <td><div className="flex gap-3"><Link className="text-link" to={`/offers/${o._id}`}>View</Link><Link className="text-link" to={`/offers/${o._id}`}>Edit</Link>{user?.role === 'admin' && <button className="text-sm text-red-600" onClick={() => setPendingDelete(o)}>Delete</button>}</div></td></tr>)}
        {!offers.data?.data.length && <tr><td colSpan={7} className="py-10 text-center text-slate-500">No offers found.</td></tr>}</tbody></table>
      <div className="flex justify-between border-t p-4 text-sm"><span>{offers.data?.totalRecords || 0} offer(s)</span><div className="flex gap-2"><button className="btn-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span className="p-2">Page {page} of {offers.data?.totalPages || 1}</span>
        <button className="btn-secondary" disabled={page >= (offers.data?.totalPages || 1)} onClick={() => setPage(page + 1)}>Next</button></div></div></div>}
    <ConfirmModal open={Boolean(pendingDelete)} title="Delete Offer?" message={`Delete ${pendingDelete?.campaignName || 'this offer'} and its embedded payment information? This cannot be undone.`} confirmLabel="Delete Offer" danger pending={remove.isPending} onCancel={() => setPendingDelete(null)} onConfirm={() => pendingDelete && remove.mutate(pendingDelete._id)} />
  </div>;
}
