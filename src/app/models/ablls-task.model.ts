export interface AbllsTask {
  id?: number;
  reference?: string;
  title?: string;
  description?: string;
  domain?: string;
  baselineText?: string;
  baselineVideo?: string;
  materials?: string[];
  instructions?: string;

  createdBy?: number;
  createdAt?: string;
  updatedBy?: number;
  updatedAt?: string;
  rowVersion?: number;
}
