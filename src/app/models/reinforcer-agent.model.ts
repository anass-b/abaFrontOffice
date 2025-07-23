export interface ReinforcerAgent {
  id?: number;
  name?: string;
  type?: string;
  category?: string;
  previewUrl?: string;
  isActive?: boolean;

  createdBy?: number;
  createdAt?: string;
  updatedBy?: number;
  updatedAt?: string;
  rowVersion?: number;
}
