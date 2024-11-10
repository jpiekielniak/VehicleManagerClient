import {Component, OnInit, signal} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from "@angular/material/icon";
import { SignIn } from "./model/SignIn";
import { AuthService } from "../../services/auth.service";
import { AlertComponent } from "@coreui/angular";

@Component({
  selector: 'sign-in',
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    AlertComponent,
  ]
})

export class SignInComponent implements OnInit {
  signInForm!: FormGroup;
  hidePassword = signal(true);
  isError = signal(false);

  constructor(private fb: FormBuilder, private authService: AuthService) {
  }

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]]
    });
  }

  clickEvent(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  handleLoginError() {
    this.isError.set(true);
    setTimeout(() => {
      this.isError.set(false);
    }, 3000);
  }

  onSubmit() {
    if (this.signInForm.valid) {
      const signInData: SignIn = this.signInForm.value;
      this.authService.signIn(signInData).subscribe({
        next: () => window.location.reload(),
        error: () => this.handleLoginError()
      });
    }
  }
}
