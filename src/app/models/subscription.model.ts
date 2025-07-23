export interface Subscription {
  id?: number;
  userId?: number;
  type?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;

  createdBy?: number;
  createdAt?: string;
  updatedBy?: number;
  updatedAt?: string;
  rowVersion?: number;
}
