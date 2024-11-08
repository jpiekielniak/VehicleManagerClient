import {Component, signal} from '@angular/core';
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'sign-up',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatFormField,
    MatInput,
    MatButton,
    FormsModule,
    MatError,
    NgIf,
    ReactiveFormsModule,
    MatIcon,
    MatIconButton,
    MatSuffix
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  hide = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }


  onSubmit() {
    if (this.signUpForm.valid) {
      const {email, password} = this.signUpForm.value;

      this.authService.signUp({email, password}).subscribe(() => {
        window.location.reload();
      }, error => {
        console.error(error);
      });
    }
  }
}
