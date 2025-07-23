export interface Video {
  id?: number;
  title?: string;
  description?: string;
  category?: string;
  duration?: number;
  url?: string;
  thumbnailUrl?: string;
  isPremium?: boolean;
  useExternal?: boolean;

  createdBy?: number;
  createdAt?: string;
  updatedBy?: number;
  updatedAt?: string;
  rowVersion?: number;
}
