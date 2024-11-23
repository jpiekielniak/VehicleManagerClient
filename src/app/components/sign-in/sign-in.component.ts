import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SignIn } from '../../types/sign-in.type';
import { AuthService } from '../../services/auth/auth.service';
import { FormModule } from '@coreui/angular';
import { MaterialImports } from '../../imports/material.imports';
import { Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'sign-in',
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormModule,
    RouterLink,
    ToastModule,
    ...MaterialImports,
  ],
  providers: [MessageService],
})
export class SignInComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  signInForm!: FormGroup;
  isLoading = signal(false);

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.signInForm = this.formBuilder.group({
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
    if (this.signInForm.valid) {
      this.isLoading.set(true);

      this.authService.signIn(this.signInForm.value as SignIn)
      .subscribe({
        next: () => this.handleSignInSuccess(),
        error: () => this.showError(),
      });
    }
  }

  handleSignInSuccess() {
    this.router.navigate(['/moje-pojazdy']);
    this.isLoading.set(false);
  }

  showError() {
    this.isLoading.set(false);
    this.messageService.add({
      severity: 'warn',
      summary: 'Błąd',
      detail: 'Nieprawidłowe dane logowania',
      life: 3000,
    });
  }

  ngOnDestroy(): void {
    this.signInForm.reset();
    this.signInForm.markAsPristine();
  }
}
