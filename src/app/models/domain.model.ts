import { Category } from './category.model';

export interface Domain {
  id: number;
  name: string;
  prefix: string;
  categoryId: number;
  category?: Category;

  createdBy?: number;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  rowVersion?: number;
}
