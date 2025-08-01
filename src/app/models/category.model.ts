import { Domain } from './domain.model';
export interface Category {
  id: number;
  name: string;
  description?: string;
  domains?: Domain[];


  // Champs d'audit hérités d'Auditable
  createdBy: number;
  updatedBy?: number;
  createdAt: string;
  updatedAt?: string;
  rowVersion: number;
}
