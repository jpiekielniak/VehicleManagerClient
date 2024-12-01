import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleInfoGridComponent } from './vehicle-info-grid.component';

describe('VehicleInfoGridComponent', () => {
  let component: VehicleInfoGridComponent;
  let fixture: ComponentFixture<VehicleInfoGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleInfoGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleInfoGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
