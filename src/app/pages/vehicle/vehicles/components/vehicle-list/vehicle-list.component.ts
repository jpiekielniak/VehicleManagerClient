import { Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {Vehicle} from "../../types/vehicle.type";
import {ConfirmationService, MessageService} from "primeng/api";
import {TableModule} from "primeng/table";
import {ToolbarModule} from "primeng/toolbar";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {NgForOf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {ToastService} from "../../../../../shared/services/toast/toast.service";
import {FormsModule} from '@angular/forms';
import {DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";

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
    ButtonModule
  ],
  providers: [ConfirmationService, MessageService, ToastService],
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnDestroy {
  @Input() vehicles: Vehicle[] = [];
  @Output() navigateToDetails = new EventEmitter<string>();

  private readonly destroy$ = new Subject<void>();

  onNavigateToDetails(vehicleId: string) {
    this.navigateToDetails.emit(vehicleId);
  }

  getVehicleImage(imageUrl: string | null): string {
    return imageUrl && imageUrl.trim() ? `url(${imageUrl})` : ``;
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
