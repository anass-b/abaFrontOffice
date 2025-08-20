export interface BaselineContent {
  id?: number;
  abllsTaskId?: number;
  abllsTask?: { id: number; code: string; title: string };   // 👈 optional relation
  criteriaId?: number;
  evaluationCriteria?: { id: number; index: string; label: string }; // 👈 optional relation

  contentHtml?: string;
  file?: File;
  fileUrl?: string;

  createdBy?: number;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  rowVersion?: number;
  taskLabel?: string;
  criteriaLabel?: string;
}
