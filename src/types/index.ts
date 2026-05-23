export interface Sheet {
  _id: string;
  sheetName: string;
  sheetId: string;
  usedBy: string;
  range: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Publisher {
  _id: string;
  market: string;
  publisherName: string;
  publisherPOC: string;
  contactDate: string;
  agencyPOC: string;
  status: string;
  notes: string;
  usedBy: string;
  sheetId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  total: number; page: number; limit: number; totalPages: number;
  hasNextPage: boolean; hasPrevPage: boolean;
}

export interface PublisherResponse {
  publishers: Publisher[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
