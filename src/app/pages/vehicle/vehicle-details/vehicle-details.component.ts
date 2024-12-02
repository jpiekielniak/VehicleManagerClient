import {Component, inject, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { switchMap } from "rxjs";
import { ReactiveFormsModule } from '@angular/forms';
import { VehicleService } from "../services/vehicle/vehicle.service";
import { VehicleDetails } from "./types/vehicle-details.type";
import { CommonModule } from '@angular/common';
import { MaterialImports } from "../../../imports/material.imports";
import { Service } from "./types/service.type";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import {MenuItem} from "primeng/api";
import { CardModule } from "primeng/card";
import { MenuModule } from "primeng/menu";
import { AccordionModule } from "primeng/accordion";
import {TabViewModule} from "primeng/tabview";
import {ToastModule} from "primeng/toast";
import {ServiceBookTabComponent} from "./components/service-book-tab/service-book-tab.component";
import {VehicleInfoGridComponent} from "./components/vehicle-info-grid/vehicle-info-grid.component";
import {VehicleImageComponent} from "./components/vehicle-image/vehicle-image.component";
import {VehicleHeaderComponent} from "./components/vehicle-header/vehicle-header.component";
import {InsuranceListComponent} from "./components/insurance-list/insurance-list.component";
import {VehicleDialogService} from "../services/dialogs/vehicle/vehicle-dialog.service";
import {LoadingSpinnerComponent} from "../../../shared/components/loading-spinner/loading-spinner.component";
import {DialogService} from "primeng/dynamicdialog";

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MaterialImports,
    ProgressSpinnerModule,
    CardModule,
    MenuModule,
    AccordionModule,
    TabViewModule,
    ToastModule,
    ServiceBookTabComponent,
    VehicleInfoGridComponent,
    VehicleImageComponent,
    VehicleHeaderComponent,
    InsuranceListComponent,
    LoadingSpinnerComponent,
  ],
  providers: [DialogService, VehicleDialogService],
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.css'
})
export class VehicleDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private vehicleService = inject(VehicleService);
  private vehicleDialog = inject(VehicleDialogService);
  @ViewChild('insuranceList') insuranceList!: InsuranceListComponent;

  vehicleId: string = '';
  vehicle: VehicleDetails | null = null;
  services: Service[] = [];
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const vehicleId = params.get('id');
        this.vehicleId = vehicleId!;
        return this.vehicleService.getById(this.vehicleId);
      })
    ).subscribe({
      next: (response: VehicleDetails) => {
        this.vehicle = response;
      },
      error: (err) => {
        console.error('Failed to fetch vehicle details', err);
      }
    });

    this.items = [
      {
        label: 'Edytuj',
        icon: 'pi pi-pencil',
        command: () => this.openEditDialog()
      },
      {
        label: 'Usuń',
        icon: 'pi pi-trash',
        command: () => console.log("REMOVE")
      }
      ];
  }

  onTabChange(event: any) {
    if (event.index === 1) {
      this.insuranceList.loadInsurances();
    }
  }

  openEditDialog() {
    this.vehicleDialog.openVehicleEdit(this.vehicle!).subscribe(result => {
      if (result) {
        this.vehicle = result;
      }
    });
  }

}
