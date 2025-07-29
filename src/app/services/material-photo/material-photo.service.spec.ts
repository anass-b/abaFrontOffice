import { TestBed } from '@angular/core/testing';

import { MaterialPhotoService } from './material-photo.service';

describe('MaterialPhotoService', () => {
  let service: MaterialPhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialPhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
