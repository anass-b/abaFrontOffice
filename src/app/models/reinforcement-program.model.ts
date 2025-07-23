export interface ReinforcementProgram {
  id?: number;
  userId?: number;
  name?: string;
  type?: string;
  value?: number;
  unit?: string;
  description?: string;

  createdBy?: number;
  createdAt?: string;
  updatedBy?: number;
  updatedAt?: string;
  rowVersion?: number;
}
