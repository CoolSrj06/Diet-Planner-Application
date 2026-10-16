import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  registrationForm!: FormGroup;
  userExists = false;
  registrationFailed = false;

  // Popup Variables
  showSuccessPopup = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {

    this.registrationForm = this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            this.noWhitespaceOnlyValidator,
            Validators.maxLength(20),
            Validators.pattern(/^(?=(?:.*[A-Za-z]){3,})[A-Za-z0-9_]+$/)
          ]
        ],

        email: [
          '',
          [
            Validators.required,
            this.noSpacesInEmailValidator
          ]
        ],

        password: [
          '',
          [
            Validators.required,
            this.noWhitespaceOnlyValidator,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
            )
          ]
        ],

        confirmPassword: [
          '',
          [
            Validators.required,
            this.noWhitespaceOnlyValidator
          ]
        ],

        mobileNumber: [
          '',
          [
            Validators.required,
            this.noWhitespaceOnlyValidator,
            Validators.pattern(/^[0-9]{10}$/)
          ]
        ],

        role: ['', Validators.required],

        superKey: ['']
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  noWhitespaceOnlyValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    const value = control.value;

    if (
      typeof value === 'string' &&
      value.length > 0 &&
      value.trim().length === 0
    ) {
      return { whitespace: true };
    }

    return null;
  }

  noSpacesInEmailValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    const value = control.value;

    if (value && /\s/.test(value)) {
      return { emailSpace: true };
    }

    return null;
  }

  passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  register(): void {

    this.userExists = false;
    this.registrationFailed = false;

    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    const registerData = {
      Username: this.registrationForm.value.username,
      Email: this.registrationForm.value.email,
      Password: this.registrationForm.value.password,
      MobileNumber: this.registrationForm.value.mobileNumber,
      UserRole: this.registrationForm.value.role,
      SuperKey: this.registrationForm.value.superKey
    };

    this.authService.register(registerData)
      .subscribe({
        next: (response) => {

          console.log(response);

          // Show popup instead of alert
          this.successMessage = 'Registration Successful!';
          this.showSuccessPopup = true;
        },

        error: (error) => {

          console.log(error);

          if (
            error.error &&
            error.error.includes('Invalid Super Key')
          ) {
            alert('Invalid Nutritionist Super Key');
          }
        }
      });
  }

  onPopupOk(): void {
    this.showSuccessPopup = false;
    this.router.navigate(['/login']);
  }

  get f() {
    return this.registrationForm.controls;
  }
}
