export type Role = 'admin' | 'individual';
export interface User {
  id?: string; _id?: string; name: string; email: string; role: Role; active: boolean; createdAt?: string;
}
export interface Publisher {
  _id: string; name: string; market: string; poc: string; status: string;
  wishlist: string; agencyPoc: string; createdBy: User; updatedBy?: User;
  createdAt: string; updatedAt: string;
}
export interface PaymentDetails {
  publisherName: string; agencyPOC: string; endDate: string | null; validationDate: string | null;
  invoiceDate: string | null; paymentDate: string | null; publisherConfirmation: string;
}
export interface Offer {
  _id: string; campaignName: string; market: string; kpi: string; costingModel: string;
  payout: number; note: string; publisherId: Publisher; status: string; endDate: string;
  paymentDetails?: PaymentDetails; createdBy: User; updatedBy?: User; createdAt: string; updatedAt: string;
}
export interface Paginated<T> {
  data: T[]; page: number; limit: number; totalPages: number; totalRecords: number;
}
export interface ApiResponse<T> { success: boolean; message: string; data: T; }
export interface DashboardData {
  totalUsers?: number; totalPublishers?: number; totalOffers?: number; myPublishers?: number; myOffers?: number;
  activeOffers: number; completedOffers: number; upcomingPayments?: number; pendingPayments?: number;
  recentPublishers: Publisher[]; recentOffers: Offer[];
  monthlyStats: { year: number; month: number; count: number }[];
}
