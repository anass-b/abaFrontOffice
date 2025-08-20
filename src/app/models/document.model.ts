export interface Document {
  id?: number;
  title?: string;
  description?: string;

  /** For POST/PUT */
  categoryIds?: number[];

  /** For GET: readable category names coming from the API */
  categories?: string[];

  fileUrl?: string;   // web-relative path (/uploads/...)
  isPremium?: boolean;

  createdBy?: number;
  createdAt?: string;
  updatedBy?: number;
  updatedAt?: string;
  rowVersion?: number;
}

/** Requests for API (helps build FormData) */
export interface DocumentCreateRequest {
  title: string;
  description?: string;
  isPremium?: boolean;
  categoryIds?: number[];
  file: File; // required
}

export interface DocumentUpdateRequest {
  id: number;
  title: string;
  description?: string;
  isPremium?: boolean;
  categoryIds?: number[];
  newFile?: File; // optional
}
