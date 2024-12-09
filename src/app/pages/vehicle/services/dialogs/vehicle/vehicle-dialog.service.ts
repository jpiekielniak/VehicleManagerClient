import {inject, Injectable} from '@angular/core';
import {VehicleDetails} from "../../../vehicle-details/types/vehicle-details.type";
import {Observable} from "rxjs";
import {
  VehicleEditDialogComponent
} from "../../../vehicle-details/components/vehicle-edit-dialog/vehicle-edit-dialog.component";
import {CreateVehicleComponent} from "../../../vehicles/components/create-vehicle/create-vehicle.component";
import {DialogService} from "primeng/dynamicdialog";

@Injectable({
  providedIn: 'root'
})
export class VehicleDialogService {
  private readonly dialogService = inject(DialogService);
  private readonly defaultConfig = {
    width: '1200px',
    height: '90vh',
    showHeader: false,
    style: { maxWidth: '90vw' },
    contentStyle: { overflow: 'auto', padding: '0' },
    baseZIndex: 10000,
    modal: true,
    dismissableMask: true,
    closeOnEscape: true,
    maximizable: true
  };

  openVehicleEdit(vehicle: VehicleDetails): Observable<VehicleDetails | undefined> {
    return this.dialogService.open(VehicleEditDialogComponent, {
      ...this.defaultConfig,
      data: { vehicle }
    }).onClose;
  }

  openCreateVehicleDialog(): Observable<boolean> {
    return this.dialogService.open(CreateVehicleComponent, this.defaultConfig).onClose;
  }
}
