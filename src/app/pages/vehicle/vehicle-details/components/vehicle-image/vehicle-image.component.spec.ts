import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleImageComponent } from './vehicle-image.component';

describe('VehicleImageComponent', () => {
  let component: VehicleImageComponent;
  let fixture: ComponentFixture<VehicleImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
