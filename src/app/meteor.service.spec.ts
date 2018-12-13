import { TestBed } from '@angular/core/testing';

import { MeteorService } from './meteor.service';

describe('MeteorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MeteorService = TestBed.get(MeteorService);
    expect(service).toBeTruthy();
  });
});
