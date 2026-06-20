import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import type { ApiResponse, DashboardData } from '../types';

export default function DashboardPage() {
  const { user } = useAuth();
  const query = useQuery({ queryKey: ['dashboard'], queryFn: async () => (await api.get<ApiResponse<DashboardData>>('/dashboard')).data.data });
  if (query.isLoading) return <p>Loading dashboard…</p>;
  if (query.error || !query.data) return <div className="error-box">{errorMessage(query.error)}</div>;
  const d = query.data;
  const cards = user?.role === 'admin'
    ? [['Total Users', d.totalUsers], ['Publishers', d.totalPublishers], ['Offers', d.totalOffers], ['Active Offers', d.activeOffers], ['Completed Offers', d.completedOffers], ['Pending Payments', d.pendingPayments]]
    : [['My Publishers', d.myPublishers], ['My Offers', d.myOffers], ['Active Offers', d.activeOffers], ['Completed Offers', d.completedOffers]];
  return <div><h2 className="page-title">Dashboard</h2><p className="page-subtitle">Publisher and Offer activity at a glance.</p>
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([label, value]) => <div className="card" key={String(label)}><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold">{value ?? 0}</p></div>)}</div>
    <div className="mt-6 grid gap-6 xl:grid-cols-2"><section className="card"><div className="flex justify-between"><h3 className="section-title">Recent Publishers</h3><Link className="text-link" to="/publishers">View all</Link></div><div className="mt-4 space-y-3">{d.recentPublishers.map((p) =>
      <Link className="flex justify-between border-b pb-3" key={p._id} to={`/publishers/${p._id}`}><span>{p.name}</span><span className="badge">{p.status}</span></Link>)}</div></section>
      <section className="card"><div className="flex justify-between"><h3 className="section-title">Recent Offers</h3><Link className="text-link" to="/offers">View all</Link></div><div className="mt-4 space-y-3">{d.recentOffers.map((o) =>
        <Link className="flex justify-between border-b pb-3" key={o._id} to={`/offers/${o._id}`}><div><p>{o.campaignName}</p><p className="text-xs text-slate-500">{o.publisherId?.name}</p></div><span className="badge">{o.status}</span></Link>)}</div></section></div>
  </div>;
}
