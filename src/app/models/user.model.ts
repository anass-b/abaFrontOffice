import { ParentInfo } from "./parent-info.model";
import { ProfessionalInfo } from './professional-info.model';

export interface User {
  id?: number;
  email?: string;
  passwordHash?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isVerified?: boolean;
  isAdmin?: boolean;

  profileType?: 'parent' | 'pro'; // ou string si tu veux plus de flexibilité

  parentInfo?: ParentInfo | null;
  professionalInfo?: ProfessionalInfo  | null;

  createdBy?: number;
  createdAt?: string;
  updatedBy?: number;
  updatedAt?: string;
  rowVersion?: number;
}
