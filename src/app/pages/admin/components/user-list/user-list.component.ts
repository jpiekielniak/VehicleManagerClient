import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {TableModule} from "primeng/table";
import {AdminUser} from "../../types/admin.types";
import {TagModule} from "primeng/tag";
import {DockModule} from "primeng/dock";
import {PaginatorModule} from "primeng/paginator";
import {InputTextModule} from "primeng/inputtext";
import {PaginationService} from "../../../../shared/services/pagination/pagination.service";
import {PaginationComponent} from "../../../../shared/components/pagination/pagination.component";
import {DatePipe} from "@angular/common";
import {ButtonDirective} from "primeng/button";
import {Ripple} from "primeng/ripple";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    DockModule,
    PaginatorModule,
    InputTextModule,
    PaginationComponent,
    DatePipe,
    ButtonDirective,
    Ripple
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  @Input() users: AdminUser[] = [];
  @Input() loading = false;
  @Input() totalItems = 0;

  @Output() deleteUser = new EventEmitter<AdminUser>();
  @Output() pageChange = new EventEmitter<{ pageIndex: number, pageSize: number, searchEmail : string }>();

  protected readonly paginationService = inject(PaginationService)
  searchEmail = '';
  debounceTimer: any;

  onSearchChange() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.pageChange.emit({
        pageIndex: 0,
        pageSize: this.paginationService.getCurrentState().pageSize,
        searchEmail: this.searchEmail
      });
    }, 300);
  }

  onDeleteUser(user: AdminUser) {
    this.deleteUser.emit(user);
  }

  onPageChange(event: any) {
    this.pageChange.emit(event);
  }
}
