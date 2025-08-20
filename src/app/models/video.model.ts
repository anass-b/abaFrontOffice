export interface Video {
  id?: number;
  title?: string;
  description?: string;

  /** For POST/PUT */
  categoryIds?: number[];

  /** For GET: readable category names coming from the API */
  categories?: string[];

  duration?: number;
  url?: string;            // external only (YouTube/Vimeo/Drive/…)
  thumbnailUrl?: string;
  isPremium?: boolean;
  useExternal?: boolean;   // server sets true

  createdBy?: number;
  createdAt?: string;
  updatedBy?: number;
  updatedAt?: string;
  rowVersion?: number;
}
