import { EvaluationCriteria } from './evaluation-criteria.model';
import { MaterialPhoto } from './material-photo.model';
import { BaselineContent } from './baseline-content.model';
import { Domain } from './domain.model';

export interface AbllsTask {
  id?: number;
  code: string;
  reference?: string;
  title: string;
  description?: string;
  domainId: number;
  domain?: Domain;

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

  expectedCriteriaCount?: number;
  status?: string;

   observation?: string;


  baselineContent?: BaselineContent;
  evaluationCriterias?: EvaluationCriteria[];
  materialPhotos?: MaterialPhoto[];

  createdBy?: number;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  rowVersion?: number;
}
