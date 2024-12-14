import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { DatePipe, NgIf } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MenuItem } from "primeng/api";
import { Button } from "primeng/button";
import { CardModule } from "primeng/card";
import { MenuModule } from "primeng/menu";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { ProgressSpinnerModule } from "primeng/progressspinner";

import { AuthService } from "../auth/shared/services/auth.service";
import { ConfirmDialogService } from "../../shared/services/dialogs/confirm/confirm-dialog.service";
import { ToastService } from '../../shared/services/toast/toast.service';
import { UserCompleteData } from "../../shared/types/user-complete-data.type";
import {UserDetails} from "./types/user-details.type";
import {DialogService} from "primeng/dynamicdialog";

interface UserDetailsState {
  isLoading: boolean;
  isEditing: boolean;
  isSubmitting: boolean;
  error: string | null;
  userDetails: UserDetails | null;
  editedUser: UserCompleteData;
}

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    NgIf,
    Button,
    CardModule,
    InputMaskModule,
    InputTextModule,
    MenuModule,
    ProgressSpinnerModule,
  ],
  providers: [ToastService, ConfirmDialogService, DialogService],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  @ViewChild('editForm') private readonly editForm!: NgForm;

  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly menuItems: MenuItem[] = [
    {
      label: 'Edytuj dane',
      icon: 'pi pi-pencil',
      command: () => this.toggleEdit()
    },
    {
      label: 'Usuń konto',
      icon: 'pi pi-trash',
      styleClass: 'text-red-600',
      command: () => this.confirmDeleteAccount()
    }
  ];

  protected state: UserDetailsState = {
    isLoading: false,
    isEditing: false,
    isSubmitting: false,
    error: null,
    userDetails: null,
    editedUser: this.getInitialEditedUserState()
  };

  ngOnInit(): void {
    this.loadUserDetails();
  }

  protected async onSubmit(): Promise<void> {
    this.state.isSubmitting = true;
    this.state.error = null;

    try {
      const updatedData = this.prepareUpdateData();
      await this.authService.completeUserData(updatedData).pipe(
        finalize(() => this.state.isSubmitting = false)
      ).toPromise();

      this.state.isEditing = false;
      await this.loadUserDetails();
      this.toastService.showSuccess('Dane użytkownika zostały zaktualizowane');
    } catch (error) {
      this.handleError('Nie udało się zaktualizować danych użytkownika');
    }
  }

  protected toggleEdit(): void {
    this.state.isEditing = !this.state.isEditing;

    if (this.state.isEditing && this.state.userDetails) {
      this.state.editedUser = {
        userId: this.state.userDetails.id,
        firstName: this.state.userDetails.firstName ?? null,
        lastName: this.state.userDetails.lastName ?? null,
        phoneNumber: this.state.userDetails.phoneNumber ?? null
      };
    }
  }

  protected cancelEdit(): void {
    this.state.isEditing = false;
    this.state.error = null;
    this.state.editedUser = this.getInitialEditedUserState();
  }

  private async confirmDeleteAccount(): Promise<void> {
    const confirmed = await this.confirmDialogService
      .openConfirmDialog('swoje konto')
      .toPromise();

    if (confirmed) {
      await this.deleteAccount();
    }
  }

  private async deleteAccount(): Promise<void> {
    try {
      const userId = this.state.userDetails?.id;
      if (!userId) throw new Error('Brak ID użytkownika');

      await this.authService.deleteAccount(userId);
      await this.authService.signOut();
      await this.router.navigate(['/']);
      this.toastService.showSuccess('Konto zostało usunięte');
    } catch (error) {
      this.toastService.showError('Nie udało się usunąć konta');
    }
  }

  private async loadUserDetails(): Promise<void> {
    this.state.isLoading = true;
    this.state.error = null;

    try {
      const response = await this.authService.getUserDetails().pipe(
        finalize(() => this.state.isLoading = false),
        catchError(() => {
          this.handleError('Nie udało się pobrać danych użytkownika');
          return of(null);
        })
      ).toPromise();

      if (response) {
        this.state.userDetails = response;
      }
    } catch (error) {
      this.handleError('Nie udało się pobrać danych użytkownika');
    }
  }

  private prepareUpdateData(): UserCompleteData {
    const { userId, firstName, lastName, phoneNumber } = this.state.editedUser;
    const details = this.state.userDetails;

    if (!details) {
      throw new Error('Brak danych użytkownika');
    }

    return {
      userId: userId || details.id,
      firstName: firstName?.trim() ?? details.firstName,
      lastName: lastName?.trim() ?? details.lastName,
      phoneNumber: phoneNumber?.trim() ?? details.phoneNumber
    };
  }

  private getInitialEditedUserState(): UserCompleteData {
    return {
      userId: '',
      firstName: null,
      lastName: null,
      phoneNumber: null
    };
  }

  private handleError(message: string): void {
    this.toastService.showWarning(message);
    this.state.error = message;
  }
}
