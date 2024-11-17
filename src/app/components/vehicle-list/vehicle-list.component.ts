import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {
  MatTableDataSource,
  MatHeaderRow,
  MatHeaderRowDef,
  MatCell,
  MatHeaderCell,
  MatHeaderCellDef,
  MatCellDef,
  MatColumnDef,
  MatTable,
  MatRow,
  MatRowDef
} from '@angular/material/table';
import { Vehicle, VehicleListResponse, VehicleService } from '../../services/vehicle.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { NgIf } from "@angular/common";
import { MatSort } from "@angular/material/sort";
import { Subject, takeUntil, finalize } from 'rxjs';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  standalone: true,
  imports: [
    MatPaginator,
    MatHeaderRow,
    MatHeaderRowDef,
    MatCell,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatColumnDef,
    MatTable,
    MatProgressSpinner,
    NgIf,
    MatSort,
    MatRow,
    MatRowDef
  ],
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly DEFAULT_PAGE_SIZE = 5;
  private readonly ANIMATION_DELAY = 200;

  dataSource = new MatTableDataSource<Vehicle>();
  totalItemsCount = 0;
  pageSize = this.DEFAULT_PAGE_SIZE;
  isLoading = true;
  displayedColumns: string[] = ['brand', 'model', 'licensePlate'];

  @ViewChild(MatPaginator) private paginator!: MatPaginator;
  @ViewChild(MatSort) private sort!: MatSort;

  constructor(private readonly vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.initializeTable();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.loadVehicles(event.pageIndex + 1, this.pageSize);
  }

  private initializeTable(): void {
    this.dataSource.sort = this.sort;
    this.loadVehicles(1, this.pageSize);
  }

  private loadVehicles(page: number, pageSize: number): void {
    this.isLoading = true;

    this.vehicleService.getVehicles(page, pageSize)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response: VehicleListResponse) => {
          this.handleVehicleResponse(response);
          this.animateTable();
        }
      });
  }

  private handleVehicleResponse(response: VehicleListResponse): void {
    this.totalItemsCount = response.totalItemsCount;
    this.dataSource.data = response.items;
  }

  private animateTable(): void {
    setTimeout(() => {
      const table = document.querySelector('.vehicle-table');
      table?.classList.add('show');
    }, this.ANIMATION_DELAY);
  }
}
