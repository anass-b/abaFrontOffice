import { TestBed } from '@angular/core/testing';

import { EvaluationCriteriaService } from './evaluation-criteria.service';

describe('EvaluationCriteriaService', () => {
  let service: EvaluationCriteriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluationCriteriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
