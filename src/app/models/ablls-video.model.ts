export interface AbllsVideo {
  id?: number;
  taskId?: number;
  type?: string;
  description?: string;
  url?: string;
  thumbnailUrl?: string;
  useExternal?: boolean;

  createdBy?: number;
  createdAt?: string;
  updatedBy?: number;
  updatedAt?: string;
  rowVersion?: number;
}
