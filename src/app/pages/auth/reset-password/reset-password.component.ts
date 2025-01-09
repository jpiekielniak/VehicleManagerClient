import {Component, inject, OnDestroy, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ButtonDirective} from "primeng/button";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../shared/services/auth.service";
import {FormErrorService} from "../../../shared/services/form/form-error.service";
import {FormValidatorsService} from "../../../shared/services/form/form-validators.service";
import {Subject, takeUntil} from "rxjs";
import {SignIn} from "../sign-in/types/sign-in.type";
import {ToastService} from "../../../shared/services/toast/toast.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonDirective,
    RouterLink,
    NgIf
  ],
  providers: [ToastService],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly formErrorService = inject(FormErrorService);
  private readonly formValidators = inject(FormValidatorsService);
  private readonly destroy$ = new Subject<void>();

  readonly resetPasswordForm: FormGroup = this.initializeForm();
  readonly isLoading = signal<boolean>(false);


  private initializeForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', this.formValidators.EMAIL_VALIDATORS],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.resetPasswordForm.valid) {
      try {
        this.isLoading.set(true);
        await this.handleResetPassword();
      } catch (error) {
        this.showError();
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  private async handleResetPassword(): Promise<void> {
    const resetPasswordData = this.resetPasswordForm.value as SignIn;
    await this.authService.resetPassword(resetPasswordData)
      .pipe(takeUntil(this.destroy$))
      .toPromise();

    this.toastService.showSuccess('Pomyślnie wysłano link do resetowania hasła');
    await this.handleResetPasswordSuccess();
  }

  private async handleResetPasswordSuccess(): Promise<void> {
    await this.router.navigate(['/logowanie']);
  }

  getControlError(controlName: string): string | null {
    return this.formErrorService.getControlError(this.resetPasswordForm, controlName);
  }

  isFieldInvalid(controlName: string): boolean {
    return this.formErrorService.isFieldInvalid(this.resetPasswordForm, controlName);
  }

  private showError(): void {
    this.toastService.showInfo('Wystąpił błąd podczas resetowania hasła');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
