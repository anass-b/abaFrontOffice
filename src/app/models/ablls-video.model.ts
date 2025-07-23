export interface AbllsVideo {
  id?: number;
  taskId?: number;
  type?: string;
  description?: string;
  url?: string;
  thumbnailUrl?: string;

  createdBy?: number;
  createdAt?: string;
  updatedBy?: number;
  updatedAt?: string;
  rowVersion?: number;
}
