import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { EmailMessage } from "../../types/admin.types";
import { MessageModule } from "primeng/message";
import { MessagesModule } from "primeng/messages";
import { InputTextareaModule } from "primeng/inputtextarea";
import { Subject } from "rxjs";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    MessagesModule,
    InputTextareaModule,
  ],
  templateUrl: './email-form.component.html',
  styleUrl: './email-form.component.css'
})
export class EmailFormComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  emailForm: FormGroup;
  @Input() sending = false;
  @Output() emailSend = new EventEmitter<EmailMessage>();

  constructor(private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.emailForm.valid) {
      this.emailSend.emit(this.emailForm.value);
    } else {
      Object.keys(this.emailForm.controls).forEach(key => {
        const control = this.emailForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
