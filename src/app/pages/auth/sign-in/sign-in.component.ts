import {AfterViewInit, Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SignIn} from './types/sign-in.type';
import {AuthService} from '../shared/services/auth.service';
import {MaterialImports} from '../../../imports/material.imports';
import {Router, RouterLink} from '@angular/router';
import {ToastModule} from 'primeng/toast';
import {Subject, takeUntil} from "rxjs";
import {ToastService} from "../../../shared/services/toast/toast.service";
import {ButtonDirective} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {FormErrorService} from "../../../shared/services/form/form-error.service";
import {FormValidatorsService} from "../../../shared/services/form/form-validators.service";

@Component({
  selector: 'sign-in',
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ToastModule,
    ...MaterialImports,
    ButtonDirective,
    InputTextModule,
  ],
  providers: [ToastService],
})
export class SignInComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(Router).routerState.root;
  private readonly toastService = inject(ToastService);
  private readonly formErrorService = inject(FormErrorService);
  private readonly formValidators = inject(FormValidatorsService);
  private readonly destroy$ = new Subject<void>();

  readonly signInForm: FormGroup = this.initializeForm();
  readonly isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  ngOnInit(): void {
    this.setupFormValidation();
  }

  ngAfterViewInit(): void {
    this.checkRegistrationSuccess();
  }

  private initializeForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', this.formValidators.EMAIL_VALIDATORS],
      password: ['', this.formValidators.PASSWORD_VALIDATORS]
    });
  }

  private setupFormValidation(): void {
    this.signInForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.signInForm.dirty) {
          requestAnimationFrame(() => {
            this.formValidators.validateForm(
              this.signInForm,
              (key) => this.getControlError(key)
            );
          });
        }
      });
  }

  private checkRegistrationSuccess(): void {
    const registrationSuccess = this.route.snapshot.queryParams['rejestracja'] === 'sukces';
    if (registrationSuccess) {
      requestAnimationFrame(() => {
        this.toastService.showSuccess('Rejestracja zakończona pomyślnie');
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.signInForm.valid) {
      try {
        this.isLoading.set(true);
        await this.handleSignIn();
      } catch (error) {
        this.showError();
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  private async handleSignIn(): Promise<void> {
    const signInData = this.signInForm.value as SignIn;
    await this.authService.signIn(signInData)
      .pipe(takeUntil(this.destroy$))
      .toPromise();
    await this.handleSignInSuccess();
  }

  private async handleSignInSuccess(): Promise<void> {
    await this.router.navigate(['/moje-pojazdy']);
  }

  private showError(): void {
    this.toastService.showInfo('Nieprawidłowy email lub hasło');
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  getControlError(controlName: string): string | null {
    return this.formErrorService.getControlError(this.signInForm, controlName);
  }

  isFieldInvalid(controlName: string): boolean {
    return this.formErrorService.isFieldInvalid(this.signInForm, controlName);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
