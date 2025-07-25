export interface Category {
  id: number;
  name: string;
  description?: string;

  // Champs d'audit hérités d'Auditable
  createdBy: number;
  updatedBy?: number;
  createdAt: string;
  updatedAt?: string;
  rowVersion: number;
}
