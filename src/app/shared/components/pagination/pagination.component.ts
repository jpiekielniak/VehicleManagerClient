import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PaginatorModule, PaginatorState} from "primeng/paginator";

export interface PageChangeEvent {
  pageSize: number;
  pageIndex: number;
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    PaginatorModule
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() totalRecords: number = 0;
  @Input() first: number = 0;
  @Input() rows: number = 5;
  @Input() rowsPerPageOptions: number[] = [5, 10, 12];

  @Output() pageChange = new EventEmitter<PageChangeEvent>();

  onPageChange(event: PaginatorState): void {
    this.pageChange.emit({
      pageSize: event.rows!,
      pageIndex: event.page!
    });
  }
}
