export interface MaterialPhoto {
  id?: number;
  abllsTaskId?: number;
  name: string;
  description?: string;
  file?: File;
  fileUrl?: string;
  videoUrl?: string;

  createdBy?: number;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  rowVersion?: number;
}
