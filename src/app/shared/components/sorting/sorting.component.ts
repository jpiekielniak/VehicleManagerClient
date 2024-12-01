import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DropdownModule} from "primeng/dropdown";
import {PrimeTemplate} from "primeng/api";
import {PaginatorModule} from "primeng/paginator";
import {NgClass} from "@angular/common";
import {ButtonDirective} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-sorting',
  standalone: true,
  imports: [
    DropdownModule,
    PrimeTemplate,
    PaginatorModule,
    NgClass,
    ButtonDirective,
    TooltipModule
  ],
  templateUrl: './sorting.component.html',
  styleUrl: './sorting.component.css'
})
export class SortingComponent implements OnInit {
  @Input() sortOptions: SortOption[] = [];
  @Input() placeholder: string = 'Sortuj według';
  @Input() iconClass: string = 'pi pi-sort-alt';
  @Input() defaultSortDirection: 'asc' | 'desc' = 'asc';

  @Output() sortChange = new EventEmitter<SortConfig<any>>();

  selectedSortOption: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit() {
    this.sortDirection = this.defaultSortDirection;

    if (this.sortOptions.length > 0) {
      this.selectedSortOption = this.sortOptions[0].value;
    }
  }

  onSortChange() {
    this.emitSortConfig();
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.emitSortConfig();
  }

  private emitSortConfig() {
    if (this.selectedSortOption) {
      const sortConfig: SortConfig<any> = {
        field: this.selectedSortOption,
        direction: this.sortDirection
      };
      this.sortChange.emit(sortConfig);
    }
  }

  getSortOptionLabel(value: string | null): string {
    if (!value) return '';

    const option = this.sortOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  }
}

export interface SortOption {
  label: string;
  value: string;
}

export interface SortConfig<T> {
  field: keyof T;
  direction: 'asc' | 'desc';
}
