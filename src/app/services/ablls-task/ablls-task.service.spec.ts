import { TestBed } from '@angular/core/testing';

import { AbllsTaskService } from './ablls-task.service';

describe('AbllsTaskService', () => {
  let service: AbllsTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbllsTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
