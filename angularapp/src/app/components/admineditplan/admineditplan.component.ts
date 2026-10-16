import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { DietplanService } from '../../services/dietplan.service';
import { DietPlan } from '../../models/dietplan.model';

@Component({
  selector: 'app-admineditplan',
  templateUrl: './admineditplan.component.html',
  styleUrls: ['./admineditplan.component.css']
})
export class AdmineditplanComponent implements OnInit {

  editPlanForm!: FormGroup;

  showSuccessPopup = false;

  planId!: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dietplanService: DietplanService
  ) { }

  ngOnInit(): void {

    this.editPlanForm = this.fb.group({

      planName: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?! )[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/
          )
        ]
      ],

      description: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?! )[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/
          )
        ]
      ],

      duration: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
          Validators.min(1),
          Validators.max(365)
        ]
      ]

    });

    this.planId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadDietPlanById();
  }

  loadDietPlanById(): void {

    this.dietplanService
      .getDietPlanById(this.planId.toString())
      .subscribe({

        next: (plan: DietPlan) => {

          console.log('Loaded Plan:', plan);

          this.editPlanForm.patchValue({

            planName: plan.planName,

            description: plan.description,

            duration: plan.duration

          });

        },

        error: (err) => {

          console.error(
            'Error loading plan:',
            err
          );

        }

      });

  }

  get f() {

    return this.editPlanForm.controls;

  }

  updatePlan(): void {

    if (this.editPlanForm.invalid) {

      this.editPlanForm.markAllAsTouched();

      return;

    }

    const updatedPlan: DietPlan = {

      dietPlanId: this.planId,

      planName:
        this.editPlanForm.value.planName.trim(),

      description:
        this.editPlanForm.value.description.trim(),

      duration:
        Number(this.editPlanForm.value.duration),

      createdAt:
        new Date().toISOString()

    };

    console.log(
      'Updating Plan:',
      updatedPlan
    );

    this.dietplanService
      .updateDietPlan(
        this.planId.toString(),
        updatedPlan
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Diet Plan Updated Successfully',
            response
          );

          this.showSuccessPopup = true;

        },

        error: (err) => {

          console.error(
            'Error updating diet plan',
            err
          );

          console.log(
            'Status:',
            err.status
          );

          console.log(
            'Error Body:',
            err.error
          );

        }

      });

  }

  back(): void {

    this.router.navigate([
      '/adminviewplan'
    ]);

  }

  closePopup(): void {

    this.showSuccessPopup = false;

    this.router.navigate([
      '/adminviewplan'
    ]);

  }

}