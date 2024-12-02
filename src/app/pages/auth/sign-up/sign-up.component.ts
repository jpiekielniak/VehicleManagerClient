import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../shared/services/auth.service';
import {SignUp} from './types/sign-up.type';
import {Router} from '@angular/router';
import {MaterialImports} from "../../../imports/material.imports";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {ToastService} from "../../../shared/services/toast/toast.service";

@Component({
  selector: 'sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ToastModule,
    ...MaterialImports,
  ],
  providers: [MessageService, ToastService],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  protected router = inject(Router);

  signUpForm!: FormGroup;
  isLoading = signal(false);

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      this.isLoading.set(true);

      this.authService.signUp(this.signUpForm.value as SignUp)
        .subscribe({
          next: () => this.handleSignUpSuccess(),
          error: () => this.handleError(),
        });
    }
  }

  handleSignUpSuccess() {
    this.isLoading.set(false);
    this.router.navigate(['/logowanie'], {
      queryParams: {rejestracja: 'sukces'}
    });
  }

  handleError() {
    this.toastService.showError('Rejestracja nie powiodła się');
    this.isLoading.set(false);
  }

  navigateToSignIn() {
    this.router.navigate(['/logowanie']);
  }

  ngOnDestroy(): void {
    this.signUpForm.reset();
    this.isLoading.set(false);
  }
}
