import { TestBed } from '@angular/core/testing';

import { PathScheduleService } from 'src/app/path-schedule.service';

describe('PathScheduleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PathScheduleService = TestBed.get(PathScheduleService);
    expect(service).toBeTruthy();
    expect(service.getData('local')).toBeTruthy();
  });
});
