import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {VehicleDetails} from "../../../vehicle-details/types/vehicle-details.type";
import {map, Observable} from "rxjs";
import {VehicleEditDialogComponent} from "../../../vehicle-details/components/vehicle-edit-dialog/vehicle-edit-dialog.component";
import {CreateVehicleComponent} from "../../../vehicles/components/create-vehicle/create-vehicle.component";

@Injectable({
  providedIn: 'root'
})
export class VehicleDialogService {
  constructor(private dialog: MatDialog) {}

  openVehicleEdit(vehicle: VehicleDetails): Observable<VehicleDetails | undefined> {
    const dialogRef = this.dialog.open(VehicleEditDialogComponent, {
      width: '1200px',
      data: { vehicle }
    });

    return dialogRef.afterClosed();
  }

  openCreateVehicleDialog(): Observable<boolean> {
    const dialogRef = this.dialog.open(CreateVehicleComponent, {
      width: '800px'
    });

    return dialogRef.afterClosed().pipe(
      map(result => !!result)
    );
  }
}
