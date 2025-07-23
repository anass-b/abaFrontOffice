export interface OtpCode {
  id?: number;
  userId?: number;
  code?: string;
  expiresAt?: string; 
  isUsed?: boolean;

  createdBy?: number;
  createdAt?: string;
  updatedBy?: number;
  updatedAt?: string;
  rowVersion?: number;
}
