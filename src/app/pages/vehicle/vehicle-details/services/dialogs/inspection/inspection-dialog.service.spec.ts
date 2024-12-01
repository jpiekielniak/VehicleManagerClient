import { TestBed } from '@angular/core/testing';

import { InspectionDialogService } from './inspection-dialog.service';

describe('InspectionDialogService', () => {
  let service: InspectionDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InspectionDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
