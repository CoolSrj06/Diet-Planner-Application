import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login.model';
import { AuthService } from 'src/app/services/auth.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // Let the required validator handle empty values
    if (!value) {
      return null;
    }

    return value.trim().length === 0
      ? { whitespace: true }
      : null;
  };
}
export function noSpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    return /\s/.test(value)
      ? { spacesNotAllowed: true }
      : null;
  };
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  invalidCredentials = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {

    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          noSpacesValidator(),
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          )
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          noWhitespaceValidator()
        ]
      ]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  login(): void {

    this.invalidCredentials = false;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginData: Login = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {

        this.router.navigate(['']);
      },

      error: (error) => {
        console.error(error);
        this.invalidCredentials = true;
      }
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }
}