import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Button} from "primeng/button";
import {MenuModule} from "primeng/menu";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-record-list',
  standalone: true,
  imports: [
    Button,
    MenuModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './record-list.component.html',
  styleUrl: './record-list.component.css'
})
export class RecordListComponent {
  @Input() records: Array<{ id: string, title: string }> = [];
  @Input() emptyMessage: string = 'Brak wpisów';
  @Input() viewTooltip: string = 'Zobacz szczegóły';
  @Input() deleteTooltip: string = 'Usuń';
  @Input() addButtonLabel: string = 'Dodaj';

  @Output() onView = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onAdd = new EventEmitter<void>();
}
