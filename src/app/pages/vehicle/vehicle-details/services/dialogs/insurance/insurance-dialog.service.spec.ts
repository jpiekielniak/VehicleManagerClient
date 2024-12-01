import { TestBed } from '@angular/core/testing';

import { InsuranceDialogService } from './insurance-dialog.service';

describe('InsuranceDialogService', () => {
  let service: InsuranceDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsuranceDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
