import { TestBed } from '@angular/core/testing';

import { BaselineContentService } from './baseline-content.service';

describe('BaselineContentService', () => {
  let service: BaselineContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaselineContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
