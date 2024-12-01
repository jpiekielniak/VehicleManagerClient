import { TestBed } from '@angular/core/testing';

import { ServiceBookService } from './service-book.service';

describe('ServiceBookService', () => {
  let service: ServiceBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
