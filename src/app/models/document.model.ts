import { Category } from "./category.model";

export interface Document {
  id?: number;
  title?: string;
  description?: string;
  categories?: Category[];
  fileUrl?: string;
  isPremium?: boolean;

  createdBy?: number;
  createdAt?: string;
  updatedBy?: number;
  updatedAt?: string;
  rowVersion?: number;
}
