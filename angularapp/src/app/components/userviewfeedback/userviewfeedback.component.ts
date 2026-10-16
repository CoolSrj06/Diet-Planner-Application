import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Feedback } from 'src/app/models/feedback.model';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-userviewfeedback',
  templateUrl: './userviewfeedback.component.html',
  styleUrls: ['./userviewfeedback.component.css']
})
export class UserviewfeedbackComponent implements OnInit {

  feedbacks: Feedback[] = [];
  showDeletePopup = false;
  selectedId!: number;

  isLoading = true;

  paginatedFeedbacks: Feedback[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;

  constructor(private feedbackService: FeedbackService, private auth: AuthService) { }

  ngOnInit(): void {

    const userId = this.auth.getUserIdFromToken();

    if (userId) {

      this.feedbackService.getAllFeedbacksByUserId(userId)
        .subscribe({
          next: (data) => {
            console.log('Feedback Data:', data);
            this.feedbacks = data;

            this.currentPage = 1;
            this.updatePagination();

            this.isLoading = false;
          },
          error: (err) => {
            console.error(err);
            this.isLoading = false;
          }
        });

    }
  }

  openDeletePopup(id: number): void {
    console.log('Delete ID:', id);
    this.selectedId = id;
    this.showDeletePopup = true;
  }

  cancelDelete(): void {
    this.showDeletePopup = false;
  }

  confirmDelete(): void {

    this.feedbackService.deleteFeedback(
      this.selectedId.toString()
    ).subscribe({

      next: () => {

        this.feedbacks = this.feedbacks.filter(
          x => x.feedbackId !== this.selectedId
        );

        this.updatePagination();

        this.showDeletePopup = false;
      },

      error: (err) => {
        console.error(err);
      }

    });

  }

  updatePagination(): void {

    this.totalPages = Math.ceil(
      this.feedbacks.length / this.itemsPerPage
    );

    const startIndex =
      (this.currentPage - 1) * this.itemsPerPage;

    const endIndex =
      startIndex + this.itemsPerPage;

    this.paginatedFeedbacks =
      this.feedbacks.slice(startIndex, endIndex);
  }

  nextPage(): void {

    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }

  }

  previousPage(): void {

    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }

  }
}