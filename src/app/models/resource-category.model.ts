export interface ResourceCategory {
  id: number;
  name: string;
  description?: string;

  createdBy?: number;
  createdAt?: string;
  updatedBy?: number;
  updatedAt?: string;
  rowVersion?: number;
}
