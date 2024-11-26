import { TestBed } from '@angular/core/testing';

import { VehicleFilterService } from './vehicle-filter.service';

describe('VehicleFilterService', () => {
  let service: VehicleFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
