import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import ProtectedRoute from '../routes/ProtectedRoute';
import DashboardPage from './DashboardPage';
import ProfilePage from './ProfilePage';
import ReportsPage from './ReportsPage';
import UsersPage from './UsersPage';
import LoginPage from './auth/LoginPage';
import OfferDetailsPage from './offers/OfferDetailsPage';
import OfferFormPage from './offers/OfferFormPage';
import OffersPage from './offers/OffersPage';
import PublisherDetailsPage from './publishers/PublisherDetailsPage';
import PublisherFormPage from './publishers/PublisherFormPage';
import PublishersPage from './publishers/PublishersPage';

export default function App() {
  return <Routes><Route path="/login" element={<LoginPage />} /><Route element={<ProtectedRoute />}><Route element={<AppLayout />}>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/publishers" element={<PublishersPage />} /><Route path="/publishers/new" element={<PublisherFormPage />} />
    <Route path="/publishers/:id" element={<PublisherDetailsPage />} /><Route path="/publishers/:id/edit" element={<PublisherFormPage />} />
    <Route path="/offers" element={<OffersPage />} /><Route path="/offers/new" element={<OfferFormPage />} />
    <Route path="/offers/:id" element={<OfferDetailsPage />} /><Route path="/offers/:id/edit" element={<OfferFormPage />} />
    <Route path="/profile" element={<ProfilePage />} /><Route element={<ProtectedRoute role="admin" />}><Route path="/users" element={<UsersPage />} /><Route path="/reports" element={<ReportsPage />} /></Route>
  </Route></Route><Route path="*" element={<Navigate to="/dashboard" replace />} /></Routes>;
}
