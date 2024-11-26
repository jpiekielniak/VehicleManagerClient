import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {map, Observable} from "rxjs";
import {CreateVehicleComponent} from "../../components/create-vehicle/create-vehicle.component";

@Injectable({
  providedIn: 'root'
})
export class VehicleDialogService {
  constructor(private dialog: MatDialog) {}

  openCreateVehicleDialog(): Observable<boolean> {
    const dialogRef = this.dialog.open(CreateVehicleComponent, {
      width: '800px'
    });

    return dialogRef.afterClosed().pipe(
      map(result => !!result)
    );
  }
}
