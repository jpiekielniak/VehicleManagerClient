import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DropdownModule} from "primeng/dropdown";
import {PrimeTemplate} from "primeng/api";
import {PaginatorModule} from "primeng/paginator";

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    DropdownModule,
    PrimeTemplate,
    PaginatorModule
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit{
  @Input() filterOptions: string[] = [];
  @Input() placeholder: string = 'Filtruj według';
  @Input() iconClass: string = 'pi pi-filter';

  @Output() filterChange = new EventEmitter<any>();

  formattedFilterOptions: string[] = [];
  selectedOption: string = '';

  ngOnInit() {
    this.formattedFilterOptions = [
      'Wszystkie marki',
      ...this.filterOptions
    ];
  }

  onFilterChange() {
    this.filterChange.emit(this.selectedOption || '');
  }
}
