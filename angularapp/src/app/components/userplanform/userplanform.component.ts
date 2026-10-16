import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

import { DietplanService } from '../../services/dietplan.service';
import { DietPlanRequest } from '../../models/dietplanrequests.model';
import { NotificationService } from 'src/app/services/notification.service';
import { DietplanrequestService } from 'src/app/services/dietplanrequest.service';

@Component({
  selector: 'app-userplanform',
  templateUrl: './userplanform.component.html',
  styleUrls: ['./userplanform.component.css']
})
export class UserplanformComponent implements OnInit {

  applicationForm!: FormGroup;

  planId!: number;

  showSuccessPopup = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dietplanService: DietplanService,
    private dietplanrequestService: DietplanrequestService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {

    this.planId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.applicationForm = this.fb.group({
      age: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.min(16),
          Validators.max(99)
        ]
      ],
      weight: [
        '',
        [
          Validators.required,
          Validators.pattern('^-?[0-9]+$'),
          Validators.min(1),
          Validators.max(699)
        ]
      ],
      height: [
        '',
        [
          Validators.required,
          Validators.min(1)
        ]
      ],
      gender: ['', Validators.required],
      activityLevel: ['', Validators.required],
      goal: [
        '',
        [
          Validators.required,
          this.noWhitespaceOnlyValidator,
          this.noLeadingSpaceValidator,
          this.maxWordsValidator(200)
        ]
      ],
      medicalConditions: [
        '',
        [
          Validators.required,
          this.noWhitespaceOnlyValidator,
          this.noLeadingSpaceValidator,
          this.maxWordsValidator(300)
        ]
      ]
    });

  }

  get f() {
    return this.applicationForm.controls;
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

  noLeadingSpaceValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    const value = control.value;

    if (
      typeof value === 'string' &&
      /^\s/.test(value)
    ) {
      return { leadingSpace: true };
    }

    return null;

  }

  maxWordsValidator(maxWords: number) {

    return (
      control: AbstractControl
    ): ValidationErrors | null => {

      const value = control.value;

      if (!value) {
        return null;
      }

      const wordCount =
        value.trim().split(/\s+/).length;

      return wordCount > maxWords
        ? { maxWords: true }
        : null;

    };

  }

  submit(): void {

    if (this.applicationForm.invalid) {

      this.applicationForm.markAllAsTouched();

      return;

    }

    const request: DietPlanRequest = {

      UserId: this.getUserId(),
      DietPlanId: this.planId,
      Age: Number(this.applicationForm.value.age),
      Weight: Number(this.applicationForm.value.weight),
      Height: Number(this.applicationForm.value.height),
      Gender: this.applicationForm.value.gender,
      ActivityLevel:
        this.applicationForm.value.activityLevel,
      Goal: this.applicationForm.value.goal,
      MedicalConditions:
        this.applicationForm.value.medicalConditions,
      CreatedAt: new Date().toISOString(),
      Status: 'Pending'

    };

    this.dietplanService
      .addDietPlanRequest(request)
      .subscribe({

        next: (response) => {

          console.log(
            'API SUCCESS',
            response
          );

          this.dietplanrequestService
            .getAllPlanRequests()
            .subscribe(allRequests => {

              const pendingCount =
                allRequests.filter(x => {

                  const status =
                    (x.Status ?? x.Status ?? '')
                      .toString()
                      .trim()
                      .toLowerCase();

                  return status === 'pending';

                }).length;

              this.notificationService
                .updatePendingCount(
                  pendingCount
                );

            });

          this.showSuccessPopup = true;

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  getUserId(): number {

    const token = localStorage.getItem('token');

    if (!token) {
      return 0;
    }

    const decoded: any =
      jwtDecode(token);

    return Number(
      decoded.UserId
    );

  }

  back(): void {

    this.router.navigate([
      '/userviewplan'
    ]);

  }

  closePopup(): void {

    this.showSuccessPopup = false;

    this.router.navigate([
      '/userviewplan'
    ]);

  }

}