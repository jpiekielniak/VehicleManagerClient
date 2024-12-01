import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceBookTabComponent } from './service-book-tab.component';

describe('ServiceBookTabComponent', () => {
  let component: ServiceBookTabComponent;
  let fixture: ComponentFixture<ServiceBookTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceBookTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceBookTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
