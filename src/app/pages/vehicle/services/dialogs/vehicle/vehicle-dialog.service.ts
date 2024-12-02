import { Injectable } from '@angular/core';
import {VehicleDetails} from "../../../vehicle-details/types/vehicle-details.type";
import {Observable} from "rxjs";
import {VehicleEditDialogComponent} from "../../../vehicle-details/components/vehicle-edit-dialog/vehicle-edit-dialog.component";
import {CreateVehicleComponent} from "../../../vehicles/components/create-vehicle/create-vehicle.component";
import {DialogService} from "primeng/dynamicdialog";

@Injectable({
  providedIn: 'root'
})
export class VehicleDialogService {
  constructor(private dialogService: DialogService) {}

  openVehicleEdit(vehicle: VehicleDetails): Observable<VehicleDetails | undefined> {
    const dialogRef = this.dialogService.open(VehicleEditDialogComponent, {
      width: '1200px',
      data: { vehicle }
    });

    return dialogRef.onClose;
  }

  openCreateVehicleDialog(): Observable<boolean> {
    const ref = this.dialogService.open(CreateVehicleComponent, {
      header: 'Dodaj nowy pojazd',
      width: '900px',
      height: '725px'
    });

    return ref.onClose;
  }
}

