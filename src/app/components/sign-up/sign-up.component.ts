import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { SignUp } from './model/SignUp';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '@coreui/angular';

@Component({
  selector: 'sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    AlertComponent,
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  hidePassword = signal(true);
  registerCompleted = signal(false);
  isError = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]]
    });
  }

  togglePasswordVisibility(event: MouseEvent): void {
    this.hidePassword.update(value => !value);
    event.stopPropagation();
  }

  onSubmit(): void {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const signUpData: SignUp = this.signUpForm.value;
    this.authService.signUp(signUpData).subscribe({
      next: () => this.onSignUpSuccess(),
      error: (error) => this.onSignUpError(error)
    });
  }

  private onSignUpSuccess(): void {
    this.registerCompleted.set(true);
    setTimeout(() => {
      this.router.navigate(['/logowanie']);
    }, 2000);
  }

  private onSignUpError(error: any): void {
    this.isError.set(true);
    setTimeout(() => {
      this.isError.set(false);
    }, 3000);
  }
}
