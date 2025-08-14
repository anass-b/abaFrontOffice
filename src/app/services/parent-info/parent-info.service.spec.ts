import { TestBed } from '@angular/core/testing';

import { ParentInfoService } from './parent-info.service';

describe('ParentInfoService', () => {
  let service: ParentInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParentInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
