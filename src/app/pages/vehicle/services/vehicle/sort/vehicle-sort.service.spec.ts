import { TestBed } from '@angular/core/testing';

import { VehicleSortService } from './vehicle-sort.service';

describe('VehicleSortService', () => {
  let service: VehicleSortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleSortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
