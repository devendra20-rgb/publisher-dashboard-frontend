import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import type { ApiResponse, Paginated, Publisher, User } from '../../types';
import ConfirmModal from '../../modals/ConfirmModal';

export default function PublishersPage() {
  const { user } = useAuth(); const client = useQueryClient(); const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: '', market: '', status: '', userId: '' });
  const [pendingDelete, setPendingDelete] = useState<Publisher | null>(null);
  const query = useQuery({ queryKey: ['publishers', page, filters], queryFn: async () =>
    (await api.get<ApiResponse<Paginated<Publisher>>>('/publishers', { params: { page, ...filters } })).data.data });
  const users = useQuery({ queryKey: ['users', 'publisher-filter'], enabled: user?.role === 'admin', queryFn: async () =>
    (await api.get<ApiResponse<Paginated<User>>>('/users', { params: { limit: 100 } })).data.data.data });
  const remove = useMutation({ mutationFn: (id: string) => api.delete(`/publishers/${id}`), onSuccess: () => { setPendingDelete(null); client.invalidateQueries({ queryKey: ['publishers'] }); } });
  const filter = (key: string, value: string) => { setPage(1); setFilters((old) => ({ ...old, [key]: value })); };
  return <div><div className="mb-6 flex justify-between gap-4"><div><h2 className="page-title">Publishers</h2><p className="page-subtitle">Manage publisher organizations independently.</p></div>
    <Link className="btn-primary self-start" to="/publishers/new">Create Publisher</Link></div>
    <div className="card mb-5 grid gap-3 md:grid-cols-4"><input className="input" placeholder="Search name or POC…" onChange={(e) => filter('search', e.target.value)} />
      <input className="input" placeholder="Market" onChange={(e) => filter('market', e.target.value)} /><input className="input" placeholder="Status" onChange={(e) => filter('status', e.target.value)} />
      {user?.role === 'admin' && <select className="input" onChange={(e) => filter('userId', e.target.value)}><option value="">All users</option>{users.data?.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}</select>}</div>
    {(query.error || remove.error) && <div className="error-box mb-4">{errorMessage(query.error || remove.error)}</div>}
    {query.isLoading ? <p>Loading publishers…</p> : <div className="overflow-x-auto rounded-xl border bg-white"><table className="table"><thead><tr><th>Name</th><th>Market</th><th>POC</th><th>Status</th><th>Agency POC</th>{user?.role === 'admin' && <th>Owner</th>}<th>Actions</th></tr></thead>
      <tbody>{query.data?.data.map((p) => <tr key={p._id}><td className="font-medium"><Link className="text-link" to={`/publishers/${p._id}`}>{p.name}</Link></td><td>{p.market}</td><td>{p.poc}</td><td><span className="badge">{p.status}</span></td><td>{p.agencyPoc}</td>
        {user?.role === 'admin' && <td>{p.createdBy?.name}</td>}<td><div className="flex gap-3"><Link className="text-link" to={`/publishers/${p._id}/edit`}>Edit</Link>
          {user?.role === 'admin' && <button className="text-sm text-red-600" onClick={() => setPendingDelete(p)}>Delete</button>}</div></td></tr>)}
        {!query.data?.data.length && <tr><td colSpan={7} className="py-10 text-center text-slate-500">No publishers found.</td></tr>}</tbody></table>
      <div className="flex justify-between border-t p-4 text-sm"><span>{query.data?.totalRecords || 0} publisher(s)</span><div className="flex gap-2"><button className="btn-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span className="p-2">Page {page} of {query.data?.totalPages || 1}</span><button className="btn-secondary" disabled={page >= (query.data?.totalPages || 1)} onClick={() => setPage(page + 1)}>Next</button></div></div></div>}
    <ConfirmModal open={Boolean(pendingDelete)} title="Delete Publisher?" message={`Delete ${pendingDelete?.name || 'this publisher'}? Publishers with linked Offers cannot be deleted.`} confirmLabel="Delete Publisher" danger pending={remove.isPending} onCancel={() => setPendingDelete(null)} onConfirm={() => pendingDelete && remove.mutate(pendingDelete._id)} />
  </div>;
}
