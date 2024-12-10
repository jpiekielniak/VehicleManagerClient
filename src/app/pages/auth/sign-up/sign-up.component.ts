import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../shared/services/auth.service';
import {SignUp} from './types/sign-up.type';
import {Router} from '@angular/router';
import {MaterialImports} from "../../../imports/material.imports";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {ToastService} from "../../../shared/services/toast/toast.service";
import {ButtonDirective} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {FormErrorService} from "../../../shared/services/form/form-error.service";
import {Subject, takeUntil} from "rxjs";
import {FormValidatorsService} from "../../../shared/services/form/form-validators.service";

@Component({
  selector: 'sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ToastModule,
    ...MaterialImports,
    ButtonDirective,
    InputTextModule,
  ],
  providers: [MessageService, ToastService],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly formErrorService = inject(FormErrorService);
  private readonly formValidators = inject(FormValidatorsService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  readonly signUpForm: FormGroup = this.initializeForm();
  readonly isLoading = signal<boolean>(false);
  readonly showPassword = signal<boolean>(false);

  ngOnInit(): void {
    this.setupFormValidation();
  }

  private initializeForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', this.formValidators.EMAIL_VALIDATORS],
      password: ['', this.formValidators.PASSWORD_VALIDATORS],
    });
  }

  private setupFormValidation(): void {
    this.signUpForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.signUpForm.dirty) {
          requestAnimationFrame(() => {
            this.formValidators.validateForm(
              this.signUpForm,
              (key) => this.getControlError(key)
            );
          });
        }
      });
  }

  async onSubmit(): Promise<void> {
    if (this.signUpForm.valid) {
      try {
        this.isLoading.set(true);
        await this.handleSignUp();
      } catch (error) {
        this.handleError();
      }
    }
  }

  private async handleSignUp(): Promise<void> {
    await this.authService.signUp(this.signUpForm.value as SignUp)
      .pipe(takeUntil(this.destroy$))
      .toPromise();

    await this.handleSignUpSuccess();
  }

  private async handleSignUpSuccess(): Promise<void> {
    this.isLoading.set(false);
    await this.router.navigate(['/logowanie'], {
      queryParams: { rejestracja: 'sukces' }
    });
  }

  private handleError(): void {
    this.toastService.showError('Rejestracja nie powiodła się');
    this.isLoading.set(false);
  }

  async navigateToSignIn(): Promise<void> {
    await this.router.navigate(['/logowanie']);
  }

  getControlError(controlName: string): string | null {
    return this.formErrorService.getControlError(this.signUpForm, controlName);
  }

  isFieldInvalid(controlName: string): boolean {
    return this.formErrorService.isFieldInvalid(this.signUpForm, controlName);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.signUpForm.reset();
    this.isLoading.set(false);
  }
}
