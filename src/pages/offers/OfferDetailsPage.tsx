import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { errorMessage } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../modals/ConfirmModal';
import type { ApiResponse, Offer } from '../../types';
import PaymentDetailsCard from './PaymentDetailsCard';

export default function OfferDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [confirmEdit, setConfirmEdit] = useState(false);
  const offer = useQuery({
    queryKey: ['offer', id],
    queryFn: async () => (await api.get<ApiResponse<Offer>>(`/offers/${id}`)).data.data
  });

  if (offer.isLoading) return <p>Loading offer…</p>;
  if (offer.error || !offer.data) return <div className="error-box">{errorMessage(offer.error)}</div>;
  const item = offer.data;

  return <div>
    <div className="mb-6 flex flex-wrap justify-between gap-3">
      <div><h2 className="page-title">{item.campaignName}</h2><p className="page-subtitle">Offer Details</p></div>
      <button className="btn-secondary" onClick={() => setConfirmEdit(true)}>Edit Offer</button>
    </div>

    <section className="card">
      <h3 className="section-title mb-5">Offer Information</h3>
      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ['Campaign Name', item.campaignName],
          ['Publisher', item.publisherId?.name || '—'],
          ['Market', item.market],
          ['KPI', item.kpi || '—'],
          ['Costing Model', item.costingModel || '—'],
          ['Payout', String(item.payout)],
          ['Status', item.status],
          ['End Date', new Date(item.endDate).toLocaleDateString()],
          ['Note', item.note || '—']
        ].map(([label, value]) => <div key={label}><dt className="text-xs uppercase text-slate-500">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>)}
      </dl>
    </section>

    {user?.role === 'admin' && <PaymentDetailsCard offerId={item._id} details={item.paymentDetails} />}

    <ConfirmModal open={confirmEdit} title="Edit Offer?" message="Continue to the Offer edit form? Payment details remain attached to this Offer." confirmLabel="Continue to Edit" onCancel={() => setConfirmEdit(false)} onConfirm={() => navigate(`/offers/${item._id}/edit`)} />
  </div>;
}

