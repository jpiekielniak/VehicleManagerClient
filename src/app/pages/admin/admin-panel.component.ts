import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {TabViewModule} from "primeng/tabview";
import {UserListComponent} from "./components/user-list/user-list.component";
import {EmailFormComponent} from "./components/email-form/email-form.component";
import {AdminUser, EmailMessage} from "./types/admin.types";
import {Subject, takeUntil} from "rxjs";
import {AdminService} from "./services/admin.service";
import {ConfirmationService} from "primeng/api";
import {PaginationService} from "../../shared/services/pagination/pagination.service";
import {ToastService} from "../../shared/services/toast/toast.service";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {DockModule} from "primeng/dock";

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    ConfirmDialogModule,
    TabViewModule,
    EmailFormComponent,
    InputTextModule,
    PaginatorModule,
    TableModule,
    TagModule,
    DockModule,
    UserListComponent,
    UserListComponent
  ],
  providers: [AdminService, ConfirmationService, ToastService, PaginationService],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly adminService = inject(AdminService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly toastService = inject(ToastService);
  private readonly paginationService = inject(PaginationService);

  users: AdminUser[] = [];
  totalItems = 0;
  loading = false;
  sending = false;

  ngOnInit() {
    this.loadUsers({
      pageIndex: this.paginationService.getCurrentState().pageIndex,
      pageSize: this.paginationService.getCurrentState().pageSize,
      searchEmail: ''
    });
  }

  loadUsers(event: { pageIndex: number, pageSize: number, searchEmail : string }) {
    this.loading = true;
    this.adminService.getUsers({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
      searchEmail: event.searchEmail
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.users = response.items;
          this.totalItems = response.totalItemsCount;
          this.paginationService.updateState({
            totalItems: response.totalItemsCount,
            pageIndex: event.pageIndex,
            pageSize: event.pageSize
          });
          this.loading = false;
        },
        error: () => {
          this.toastService.showError('Nie udało się załadować listy użytkowników');
          this.loading = false;
        }
      });
  }

  onPageChange(event: { pageIndex: number, pageSize: number, searchEmail : string }) {
    this.loadUsers(event);
  }

  confirmDelete(user: AdminUser) {
    this.confirmationService.confirm({
      message: `Czy na pewno chcesz usunąć użytkownika ${user.email}?`,
      header: 'Potwierdź usunięcie',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Tak',
      rejectLabel: 'Nie',
      accept: () => this.deleteUser(user.id)
    });
  }

  deleteUser(userId: string) {
    this.adminService.deleteUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Użytkownik został usunięty');
          this.loadUsers({
            pageIndex: this.paginationService.getCurrentState().pageIndex,
            pageSize: this.paginationService.getCurrentState().pageSize,
            searchEmail: ''
          });
        },
        error: () => {
          this.toastService.showError('Nie udało się usunąć użytkownika');
        }
      });
  }

  sendEmail(emailMessage: EmailMessage) {
    this.sending = true;
    this.adminService.sendEmail(emailMessage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Wiadomość email została wysłana');
          this.sending = false;
        },
        error: () => {
          this.toastService.showError('Nie udało się wysłać wiadomości email');
          this.sending = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
