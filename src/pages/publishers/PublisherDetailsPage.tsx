import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import api, { errorMessage } from '../../api/axios';
import type { ApiResponse, Offer, Paginated, Publisher } from '../../types';

export default function PublisherDetailsPage() {
  const { id } = useParams();
  const publisher = useQuery({ queryKey: ['publisher', id], queryFn: async () => (await api.get<ApiResponse<Publisher>>(`/publishers/${id}`)).data.data });
  const offers = useQuery({ queryKey: ['publisher-offers', id], queryFn: async () => (await api.get<ApiResponse<Paginated<Offer>>>(`/publishers/${id}/offers`)).data.data });
  if (publisher.isLoading) return <p>Loading publisher…</p>;
  if (publisher.error || !publisher.data) return <div className="error-box">{errorMessage(publisher.error)}</div>;
  const p = publisher.data;
  return <div><div className="mb-6 flex flex-wrap justify-between gap-3"><div><h2 className="page-title">{p.name}</h2><p className="page-subtitle">Publisher Details</p></div>
    <div className="flex gap-2"><Link className="btn-secondary" to={`/publishers/${p._id}/edit`}>Edit Publisher</Link><Link className="btn-primary" to={`/offers/new?publisherId=${p._id}`}>Create Offer</Link></div></div>
    <section className="card"><dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[['Market', p.market], ['POC', p.poc], ['Status', p.status], ['Wishlist', p.wishlist || '—'], ['Agency POC', p.agencyPoc || '—'], ['Created By', p.createdBy?.name || '—']].map(([k, v]) =>
      <div key={k}><dt className="text-xs uppercase text-slate-500">{k}</dt><dd className="mt-1 font-medium">{v}</dd></div>)}</dl></section>
    <section className="card mt-6"><div className="flex justify-between"><h3 className="section-title">Related Offers</h3><Link className="text-link" to={`/offers?publisherId=${p._id}`}>View all</Link></div>
      {offers.error && <div className="error-box mt-4">{errorMessage(offers.error)}</div>}<div className="mt-4 space-y-3">{offers.data?.data.map((o) =>
        <Link key={o._id} to={`/offers/${o._id}`} className="flex justify-between rounded-lg border p-3 hover:bg-slate-50"><div><p className="font-medium">{o.campaignName}</p><p className="text-xs text-slate-500">{o.market}</p></div><span className="badge">{o.status}</span></Link>)}
        {!offers.data?.data.length && <p className="text-sm text-slate-500">No offers linked to this publisher.</p>}</div></section>
  </div>;
}
