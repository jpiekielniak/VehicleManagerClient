import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleEditDialogComponent } from './vehicle-edit-dialog.component';

describe('VehicleEditDialogComponent', () => {
  let component: VehicleEditDialogComponent;
  let fixture: ComponentFixture<VehicleEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleEditDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
