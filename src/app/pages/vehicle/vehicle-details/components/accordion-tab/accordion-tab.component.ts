import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RecordListComponent} from "../record-list/record-list.component";
import {NgIf} from "@angular/common";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {LoadingSpinnerComponent} from "../../../../../shared/components/loading-spinner/loading-spinner.component";

interface Record {
  id: string;
  title: string;
}

@Component({
  selector: 'app-accordion-tab',
  standalone: true,
  imports: [
    RecordListComponent,
    NgIf,
    ProgressSpinnerModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './accordion-tab.component.html',
  styleUrl: './accordion-tab.component.css'
})
export class AccordionTabComponent {
  @Input() records: Record[] = [];
  @Input() isLoading = false;
  @Input() emptyMessage = '';
  @Input() viewTooltip = '';
  @Input() deleteTooltip = '';
  @Input() addButtonLabel = '';

  @Output() onView = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onAdd = new EventEmitter<void>();
}
