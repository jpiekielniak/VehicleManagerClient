import { TestBed } from '@angular/core/testing';

import { VehicleDialogService } from './vehicle-dialog.service';

describe('VehicleDialogService', () => {
  let service: VehicleDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
