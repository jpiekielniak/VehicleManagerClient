import {Component, inject, OnInit, signal} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SignInType } from "../../types/sign-in.type";
import { AuthService } from "../../services/auth/auth.service";
import {AlertComponent} from "@coreui/angular";
import {MaterialImports} from "../../imports/material.imports";
import {Router} from "@angular/router";

@Component({
  selector: 'sign-in',
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MaterialImports,
    AlertComponent,
  ]
})

export class SignInComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  signInForm!: FormGroup;
  hidePassword = signal(true);
  isError = signal(false);

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]]
    });
  }

  clickEvent(event: MouseEvent) : void {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  handleLoginError() : void {
    this.isError.set(true);
    setTimeout(() => {
      this.isError.set(false);
    }, 3000);
  }

  handleLoginSuccess() : void {
    this.router.navigate(['/moje-pojazdy']);
  }

  onSubmit() : void {
    if (this.signInForm.valid) {
      const signInData: SignInType = this.signInForm.value;

      this.authService.signIn(signInData).subscribe({
        next: () => this.handleLoginSuccess(),
        error: () => this.handleLoginError()
      });
    }
  }
}
