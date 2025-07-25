import { TestBed } from '@angular/core/testing';

import { AbllsVideoService } from './ablls-video.service';

describe('AbllsVideoService', () => {
  let service: AbllsVideoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbllsVideoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
