import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { DietplanService } from '../../services/dietplan.service';
import { DietPlan } from '../../models/dietplan.model';

@Component({
  selector: 'app-adminaddplan',
  templateUrl: './adminaddplan.component.html',
  styleUrls: ['./adminaddplan.component.css']
})
export class AdminaddplanComponent implements OnInit {

  dietPlanForm!: FormGroup;

  allFieldsError = false;
  duplicatePlanError = false;
  showSuccessPopup = false;

  constructor(
    private fb: FormBuilder,
    private dietplanService: DietplanService
  ) { }

  ngOnInit(): void {

    this.dietPlanForm = this.fb.group({

      planName: [
        '',
        [
          Validators.required,
          this.noLeadingWhitespaceValidator,
          this.noWhitespaceOnlyValidator,
          Validators.maxLength(30),
          Validators.pattern(/^(?=.*[A-Za-z0-9])[A-Za-z0-9 _-]+$/)
        ]
      ],

      description: [
        '',
        [
          Validators.required,
          this.noLeadingWhitespaceValidator,
          Validators.maxLength(1000)
        ]
      ],
  
      duration: [
        '',
        [
          Validators.required,
          Validators.pattern('^-?[0-9]+$'),
          Validators.min(1),
          Validators.max(366)
        ]
      ]

    });

  }


  // Prevent fields from starting with whitespace

  noLeadingWhitespaceValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    const value = control.value;

    if (
      typeof value === 'string' &&
      value.length > 0 &&
      value.startsWith(' ')
    ) {
      return {
        leadingWhitespace: true
      };
    }

    return null;
  }

  // Prevent whitespace-only values
noWhitespaceOnlyValidator(
  control: AbstractControl
): ValidationErrors | null {

  const value = control.value;

  if (
    typeof value === 'string' &&
    value.length > 0 &&
    value.trim().length === 0
  ) {
    return {
      whitespace: true
    };
  }

  return null;
}

  // Prevent < and > symbols

  noAngleBracketsValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    const value = control.value;

    if (
      typeof value === 'string' &&
      /[<>]/.test(value)
    ) {
      return {
        invalidSymbols: true
      };
    }

    return null;
  }


  submit(): void {

    this.allFieldsError = false;
    this.duplicatePlanError = false;

    if (this.dietPlanForm.invalid) {

      this.allFieldsError = true;

      this.dietPlanForm.markAllAsTouched();

      return;
    }


    const dietPlan: DietPlan = {

      dietPlanId: 0,

      planName:
        this.dietPlanForm.value.planName,

      description:
        this.dietPlanForm.value.description,

      duration:
        Number(this.dietPlanForm.value.duration),

      createdAt:
        new Date().toISOString()

    };


    this.dietplanService.addDietPlan(dietPlan).subscribe({

      next: (response) => {

        console.log(
          'Diet Plan Added Successfully',
          response
        );

        this.showSuccessPopup = true;

      },

      error: (error) => {

        console.error(
          'Error while adding plan',
          error
        );

        if (error.status === 409) {

          this.duplicatePlanError = true;

        } else {

          alert('Failed to add diet plan');

        }

      }

    });

  }


  closePopup(): void {

    this.showSuccessPopup = false;

    this.dietPlanForm.reset();

    this.allFieldsError = false;

    this.duplicatePlanError = false;

  }

}