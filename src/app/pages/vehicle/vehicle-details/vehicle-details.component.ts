import {BehaviorSubject, catchError, EMPTY, filter, firstValueFrom, map, switchMap, tap} from "rxjs";
import {Component, inject, OnInit, ViewChild} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {CardModule} from "primeng/card";
import {MenuModule} from "primeng/menu";
import {AccordionModule} from "primeng/accordion";
import {TabViewModule} from "primeng/tabview";
import {ToastModule} from "primeng/toast";
import {ServiceBookTabComponent} from "./components/service-book-tab/service-book-tab.component";
import {VehicleInfoGridComponent} from "./components/vehicle-info-grid/vehicle-info-grid.component";
import {VehicleImageComponent} from "./components/vehicle-image/vehicle-image.component";
import {VehicleHeaderComponent} from "./components/vehicle-header/vehicle-header.component";
import {InsuranceListComponent} from "./components/insurance-list/insurance-list.component";
import {LoadingSpinnerComponent} from "../../../shared/components/loading-spinner/loading-spinner.component";
import {ConfirmDialogService} from "../../../shared/services/dialogs/confirm/confirm-dialog.service";
import {DialogService} from "primeng/dynamicdialog";
import {ServiceDialogService} from "./services/dialogs/service/service-dialog.service";
import {VehicleDialogService} from "../services/dialogs/vehicle/vehicle-dialog.service";
import {ActivatedRoute, Router} from "@angular/router";
import {VehicleService} from "../services/vehicle/vehicle.service";
import {MenuItem} from "primeng/api";
import {VehicleDetails} from "./types/vehicle-details.type";
import {Service} from "./types/service.type";
import {InsuranceDialogService} from "./services/dialogs/insurance/insurance-dialog.service";

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
  providers: [ConfirmDialogService, DialogService, InsuranceDialogService, ServiceDialogService, VehicleDialogService],
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.css'
})
export class VehicleDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly vehicleService = inject(VehicleService);
  private readonly vehicleDialog = inject(VehicleDialogService);
  private readonly confirmDialogService = inject(ConfirmDialogService);

  @ViewChild('insuranceList') insuranceList!: InsuranceListComponent;

  readonly items: MenuItem[] = [
    {
      label: 'Edytuj',
      icon: 'pi pi-pencil',
      command: () => this.openEditDialog()
    },
    {
      label: 'Usuń',
      icon: 'pi pi-trash',
      command: () => this.confirmVehicleDelete()
    }
  ];

  vehicleId = '';
  vehicle$ = new BehaviorSubject<VehicleDetails | null>(null);
  services: Service[] = [];

  get vehicle(): VehicleDetails | null {
    return this.vehicle$.value;
  }

  ngOnInit(): void {
    this.loadVehicleDetails();
  }

  onTabChange(event: any): void {
    if (event.index === 1) {
      this.insuranceList.loadInsurances();
    }
  }

  async openEditDialog(): Promise<void> {
    if (!this.vehicle) return;

    await firstValueFrom(
      this.vehicleDialog.openVehicleEdit(this.vehicle).pipe(
        filter((result): result is VehicleDetails => !!result),
        tap((updatedVehicle) => {
          this.vehicle$.next(updatedVehicle);
        })
      )
    );
  }

  async confirmVehicleDelete(): Promise<void> {
    if (!this.vehicle) return;

    const confirmed = await firstValueFrom(
      this.confirmDialogService.openConfirmDialog(
        `${this.vehicle.brand} ${this.vehicle.model}`
      )
    );

    if (confirmed) {
      await firstValueFrom(this.vehicleService.deleteVehicle(this.vehicleId));
      this.router.navigate(['/moje-pojazdy']);
    }
  }

  private loadVehicleDetails(): void {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter((id): id is string => !!id),
      tap(id => this.vehicleId = id),
      switchMap(id => this.vehicleService.getById(id)),
      catchError(() => {
        return EMPTY;
      })
    ).subscribe(vehicle => this.vehicle$.next(vehicle));
  }
}
