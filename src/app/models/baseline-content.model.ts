export interface BaselineContent {
  id?: number;
  abllsTaskId?: number;
  criteriaId?: number;

  contentHtml?: string;

  file?: File;           // PDF ou image uploadé
  fileUrl?: string;      // chemin déjà enregistré (lecture uniquement)

  createdBy?: number;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  rowVersion?: number;
}
