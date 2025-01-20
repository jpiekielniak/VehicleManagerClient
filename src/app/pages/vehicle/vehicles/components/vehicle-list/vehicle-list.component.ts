import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {Vehicle} from "../../types/vehicle.type";
import {ConfirmationService, MessageService} from "primeng/api";
import {TableModule} from "primeng/table";
import {ToolbarModule} from "primeng/toolbar";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {NgForOf, NgIf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {ToastService} from "../../../../../shared/services/toast/toast.service";
import {FormsModule} from '@angular/forms';
import {DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";
import {LoadingSpinnerComponent} from "../../../../../shared/components/loading-spinner/loading-spinner.component";

export interface PageChangeEvent {
  pageSize: number;
  pageIndex: number;
}

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  standalone: true,
  imports: [
    TableModule,
    ToolbarModule,
    ConfirmDialogModule,
    NgForOf,
    PaginatorModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    LoadingSpinnerComponent,
    NgIf
  ],
  providers: [ConfirmationService, MessageService, ToastService],
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit, OnDestroy {
  @Output() navigateToDetails = new EventEmitter<string>();

  private readonly destroy$ = new Subject<void>();
  private loadedImagesCount = 0;
  isLoading = true;
  isImageLoading: { [key: string]: boolean } = {};


  ngOnInit() {
    this.resetLoadingState();
  }

  @Input() set vehicles(value: Vehicle[]) {
    if (value !== this._vehicles) {
      this._vehicles = value;
      this.resetLoadingState();
    }
  }
  protected _vehicles: Vehicle[] = [];

  private resetLoadingState() {
    this.isLoading = true;
    this.loadedImagesCount = 0;

    this._vehicles.forEach(vehicle => {
      this.isImageLoading[vehicle.vehicleId] = true;
    });

    if (!this._vehicles.length) {
      this.isLoading = false;
      return;
    }

    const vehiclesWithImages = this._vehicles.filter(v => v.imageUrl);
    if (!vehiclesWithImages.length) {
      this.isLoading = false;
      return;
    }

    setTimeout(() => {
      this.isLoading = false;
      Object.keys(this.isImageLoading).forEach(key => {
        this.isImageLoading[key] = false;
      });
    }, 10000);
  }

  onImageLoad(vehicleId: string) {
    this.loadedImagesCount++;
    this.isImageLoading[vehicleId] = false;

    if (this.loadedImagesCount === this._vehicles.filter(v => v.imageUrl).length) {
      this.isLoading = false;
    }
  }

  getVehicleImage(imageUrl: string | null): string {
    return imageUrl && imageUrl.trim() ? `url(${imageUrl})` : '';
  }

  onNavigateToDetails(vehicleId: string) {
    this.navigateToDetails.emit(vehicleId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
