import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Feedback } from 'src/app/models/feedback.model';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-useraddfeedback',
  templateUrl: './useraddfeedback.component.html',
  styleUrls: ['./useraddfeedback.component.css']
})
export class UseraddfeedbackComponent {

  feedbackForm: FormGroup;
  showSuccessPopup = false;

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private auth: AuthService,
    private router: Router
  ) {

    this.feedbackForm = this.fb.group({
      feedback: [
        '',
        [
          Validators.required,
          this.noWhitespaceOnlyValidator,
          Validators.maxLength(200)
        ]
      ]
    });

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

  submitFeedback(): void {

    if (this.feedbackForm.invalid) {
      this.feedbackForm.markAllAsTouched();
      return;
    }

    const feedback: Feedback = {
      feedbackId: 0,
      UserId: Number(this.auth.getUserIdFromToken()),
      feedbackText: this.feedbackForm.value.feedback,
      Date: new Date()
    };

    this.feedbackService.sendFeedback(feedback)
      .subscribe({
        next: () => {
          this.showSuccessPopup = true;

          setTimeout(() => {
            this.router.navigate(['/userviewfeedback']);
          }, 5000);

        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  closePopup(): void {
    this.showSuccessPopup = false;
    this.feedbackForm.reset();
  }

  get feedback() {
    return this.feedbackForm.get('feedback');
  }

}