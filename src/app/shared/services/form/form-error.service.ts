import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

type ErrorMessageFn = (err: any) => string;
type ErrorMessages = { [key: string]: string | ErrorMessageFn };

@Injectable({
  providedIn: 'root'
})
export class FormErrorService {
  private defaultErrorMessages: ErrorMessages = {
    required: 'To pole jest wymagane',
    minlength: (err) => `Minimalna długość to ${err.requiredLength} znaków`,
    maxlength: (err) => `Maksymalna długość to ${err.requiredLength} znaków`,
    min: (err) => `Minimalna wartość to ${err.min}`,
    max: (err) => `Maksymalna wartość to ${err.max}`,
    email: () => `Nieprawidłowy adres email`,
    pattern: 'Nieprawidłowy format'
  };

  getError(control: AbstractControl | null, customMessages?: ErrorMessages): string | null {
    if (!control?.errors || !control.touched) return null;

    const errorMessages = { ...this.defaultErrorMessages, ...customMessages };
    const [errorType] = Object.keys(control.errors);
    const errorMessage = errorMessages[errorType];

    return typeof errorMessage === 'function'
      ? errorMessage(control.errors[errorType])
      : errorMessage;
  }

  getControlError(form: FormGroup, controlName: string, customMessages?: ErrorMessages): string | null {
    return this.getError(form.get(controlName), customMessages);
  }

  isFieldInvalid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return !!control && control.invalid && control.touched;
  }
}
