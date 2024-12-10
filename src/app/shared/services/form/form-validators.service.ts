import {Injectable} from '@angular/core';
import {FormGroup, ValidatorFn, Validators} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidatorsService {
  private readonly currentYear = new Date().getFullYear();

  readonly EMAIL_VALIDATORS: ValidatorFn[] = [
    Validators.required,
    Validators.email,
    Validators.maxLength(255)
  ];

  readonly PASSWORD_VALIDATORS: ValidatorFn[] = [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(16),
  ];

  readonly BASIC_TEXT_INPUT_VALIDATORS: ValidatorFn[] = [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50),
    Validators.pattern(/^[a-zA-Z0-9\s-]+$/)
  ];

  readonly TITLE_VALIDATORS: ValidatorFn[] = [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50),
  ];

  readonly YEAR_VALIDATORS: Validators[] = [
    Validators.required,
    Validators.min(1900),
    Validators.max(this.currentYear)
  ]

  readonly LICENSE_PLATE_VALIDATORS: Validators[] = [
    Validators.required,
    Validators.pattern(/^[A-Z]{1,3} ?[A-Z0-9]{1,5}(?: [A-Z0-9]{1,5})?$/)
  ]

  readonly VIN_VALIDATORS: Validators[] = [
    Validators.required,
    Validators.minLength(17),
    Validators.maxLength(17),
    Validators.pattern(/^[A-HJ-NPR-Z0-9]+$/)
  ]

  readonly ENGINE_CAPACITY_VALIDATORS: Validators[] = [
    Validators.required,
    Validators.min(0),
    Validators.max(10_000)
  ]

  readonly ENGINE_POWER_VALIDATORS: Validators[] = [
    Validators.required,
    Validators.min(0),
    Validators.max(2_000)
  ]

  readonly REQUIRED_VALIDATOR: Validators = [
    Validators.required
  ]

  readonly DATE_VALIDATORS: Validators = [
    Validators.required,
    Validators.max(new Date().getDate())
  ]

  readonly DESCRIPTION_VALIDATORS: Validators = [
    Validators.maxLength(500)
    ]

  validateForm(form: FormGroup, getError: (key: string) => void): void {
    const controls = form.controls;
    Object.keys(controls)
      .filter(key => controls[key].dirty && controls[key].invalid)
      .forEach(key => getError(key));
  }
}
