export interface EvaluationCriteria {
  id?: number;
  abllsTaskId?: number;
  label: string;
  consigne?: string;
  expectedResponse?: string;
  guidanceType?: string;

  useExternalDemonstrationVideo?: boolean;
  demonstrationVideoUrl?: string;
  demonstrationVideoFile?: File;
  demonstrationVideoPath?: string;
  demonstrationThumbnail?: File;
  demonstrationThumbnailUrl?: string;

  
  createdBy?: number;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  rowVersion?: number;

  // 🧩 Association à plusieurs matériels
  materialPhotoIds?: number[];
}
