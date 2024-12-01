import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RecordListComponent} from "../record-list/record-list.component";
import {NgIf} from "@angular/common";
import {ProgressSpinnerModule} from "primeng/progressspinner";

@Component({
  selector: 'app-accordion-tab',
  standalone: true,
  imports: [
    RecordListComponent,
    NgIf,
    ProgressSpinnerModule
  ],
  templateUrl: './accordion-tab.component.html',
  styleUrl: './accordion-tab.component.css'
})
export class AccordionTabComponent {
  @Input() records: Array<{ id: string, title: string }> = [];
  @Input() isLoading = false;
  @Input() emptyMessage: string = '';
  @Input() viewTooltip: string = '';
  @Input() deleteTooltip: string = '';
  @Input() addButtonLabel: string = '';

  @Output() onView = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onAdd = new EventEmitter<void>();
}
