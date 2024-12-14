import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Button} from "primeng/button";
import {MenuModule} from "primeng/menu";
import {NgForOf, NgIf} from "@angular/common";

interface Record {
  id: string;
  title: string;
}

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
  @Input() records: Record[] = [];
  @Input() emptyMessage = 'Brak wpisów';
  @Input() viewTooltip = 'Zobacz szczegóły';
  @Input() deleteTooltip = 'Usuń';
  @Input() addButtonLabel = 'Dodaj';

  @Output() onView = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onAdd = new EventEmitter<void>();

  protected trackByFn(index: number, record: Record): string {
    return record.id;
  }

  protected getRecordTitle(record: Record): string {
    return record.title ?? 'Brak tytułu';
  }
}
