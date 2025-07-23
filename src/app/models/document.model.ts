export interface Document {
  id?: number;
  title?: string;
  description?: string;
  category?: string;
  fileUrl?: string;
  isPremium?: boolean;

  createdBy?: number;
  createdAt?: string;
  updatedBy?: number;
  updatedAt?: string;
  rowVersion?: number;
}
