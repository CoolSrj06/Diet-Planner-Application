import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';

@Component({
  selector: 'app-admin-view-feedback',
  templateUrl: './adminviewfeedback.component.html',
  styleUrls: ['./adminviewfeedback.component.css']
})
export class AdminviewfeedbackComponent implements OnInit {

  feedbacks: any[] = [];
  selectedUser: any = null;
  showModal: boolean = false;
  isLoadingUser: boolean = false;

  paginatedFeedbacks: any[] = [];

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;

  isLoadingFeedbacks: boolean = false;

  constructor(private feedbackService: FeedbackService) { }

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.isLoadingFeedbacks = true;

    this.feedbackService.getFeedbacks().subscribe({
      next: (response: any[]) => {
        this.feedbacks = response || [];

        this.currentPage = 1;
        this.updatePagination();

        this.feedbacks.forEach((feedback) => {
          // Fix: Read either UserId or userId safely
          const userId = feedback.UserId ?? feedback.userId;

          if (userId) {
            this.feedbackService.getUserNameByUserId(userId).subscribe({
              next: (res: any) => {
                feedback.userName = res?.username || res?.userName || 'User';
              },
              error: (err) => {
                console.error(`Error fetching username for userId ${userId}:`, err);
                feedback.userName = 'N/A';
              }
            });
          } else {
            feedback.userName = 'N/A';
          }
        });

        this.isLoadingFeedbacks = false;
      },
      error: (error) => {
        console.error('Error loading feedbacks', error);
        this.feedbacks = [];
        this.isLoadingFeedbacks = false;
      }
    });
  }

  showProfile(feedback: any): void {
    this.selectedUser = null;
    this.showModal = true;
    this.isLoadingUser = true;

    // Fix: Read either UserId or userId safely
    const userId = feedback.UserId ?? feedback.userId;

    if (userId) {
      this.feedbackService.getUserDetailsByUserId(userId).subscribe({
        next: (user: any) => {
          this.selectedUser = user;
          this.isLoadingUser = false;
        },
        error: (err) => {
          console.error('Error fetching user details:', err);
          this.selectedUser = null;
          this.isLoadingUser = false;
        }
      });
    } else {
      this.isLoadingUser = false;
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedUser = null;
    this.isLoadingUser = false;
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.feedbacks.length / this.itemsPerPage) || 1;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedFeedbacks = this.feedbacks.slice(startIndex, endIndex);
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