import { TestBed } from '@angular/core/testing';

import { ServiceDialogService } from './service-dialog.service';

describe('ServiceDialogService', () => {
  let service: ServiceDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
