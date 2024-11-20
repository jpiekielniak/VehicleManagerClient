import {Component, inject, OnInit, signal} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { SignUp } from '../../types/sign-up.type';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '@coreui/angular';
import {MaterialImports} from "../../imports/material.imports";

@Component({
  selector: 'sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MaterialImports,
    AlertComponent,
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  signUpForm!: FormGroup;
  hidePassword = signal(true);
  registerCompleted = signal(false);
  isError = signal(false);


  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.signUpForm = this.formBuilder.group({
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
      error: () => this.onSignUpError()
    });
  }

  private onSignUpSuccess(): void {
    this.registerCompleted.set(true);
    setTimeout(() => {
      this.router.navigate(['/logowanie']);
    }, 2000);
  }

  private onSignUpError(): void {
    this.isError.set(true);
    setTimeout(() => {
      this.isError.set(false);
    }, 3000);
  }
}
