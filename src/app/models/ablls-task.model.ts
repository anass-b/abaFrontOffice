import { EvaluationCriteria } from './evaluation-criteria.model';
import { MaterialPhoto } from './material-photo.model';
import { BaselineContent } from './baseline-content.model';

export interface AbllsTask {
  id?: number;
  code: string;
  reference?: string;
  title: string;
  description?: string;
  domain?: string;
  explanationVideoUrl?: string;
  explanationVideoPath?: string;
  explanationVideoFile?: File;
  explanationVideoThumbnail?: File;
  explanationVideoThumbnailUrl?: string;
  explanationUseExternal?: boolean;

  evaluationScoring?: string;
  exampleConsigne?: string;
  expectedResponseType?: string;
  guidanceType?: string;

  baselineContent?: BaselineContent;
  evaluationCriterias?: EvaluationCriteria[];
  materialPhotos?: MaterialPhoto[];

  createdBy?: number;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  rowVersion?: number;
}
