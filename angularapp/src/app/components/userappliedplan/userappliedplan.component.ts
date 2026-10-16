import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { DietplanrequestService } from 'src/app/services/dietplanrequest.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-userappliedplan',
  templateUrl: './userappliedplan.component.html',
  styleUrls: ['./userappliedplan.component.css']
})
export class UserappliedplanComponent implements OnInit {

  dietPlanRequests: any[] = [];
  filteredPlans: any[] = [];

  searchText = '';

  showDeletePopup = false;

  selectedRequestId = 0;

  isLoading = true;

  constructor(
    private dietPlanRequestService: DietplanrequestService
  ) { }

  ngOnInit(): void {
    this.loadAppliedPlans();
  }

  loadAppliedPlans(): void {

    const token = localStorage.getItem('token');

    if (!token) {
      this.dietPlanRequests = [];
      this.filteredPlans = [];
      this.isLoading = false;
      return;
    }

    this.isLoading = true;

    const decoded: any = jwtDecode(token);
    const userId = decoded.UserId;

    this.dietPlanRequestService
      .getAppliedPlans(userId.toString())
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (data: any) => {

          console.log('API Response:', data);

          if (!data) {

            this.dietPlanRequests = [];
            this.filteredPlans = [];

          } else if (Array.isArray(data)) {

            this.dietPlanRequests = data;
            this.filteredPlans = [...data];

          } else {

            this.dietPlanRequests = [data];
            this.filteredPlans = [data];

          }

        },

        error: (err) => {

          console.error('Error:', err);

          this.dietPlanRequests = [];
          this.filteredPlans = [];

        }
      });
  }

  searchPlans(): void {

    const value = this.searchText.trim();

    if (!value) {
      this.filteredPlans = [...this.dietPlanRequests];
      return;
    }

    this.filteredPlans = this.dietPlanRequests.filter(
      (plan: any) =>
        plan.dietPlanId.toString().includes(value)
    );
  }

  openDeletePopup(id: number): void {

    this.selectedRequestId = id;
    this.showDeletePopup = true;

  }

  cancelDelete(): void {

    this.showDeletePopup = false;

  }

  confirmDelete(): void {

    console.log(
      'Deleting Request Id:',
      this.selectedRequestId
    );

    this.dietPlanRequestService
      .deletePlanApplication(
        this.selectedRequestId.toString()
      )
      .subscribe({

        next: (res) => {

          console.log('Delete Success:', res);

          this.dietPlanRequests =
            this.dietPlanRequests.filter(
              (x: any) =>
                x.dietPlanRequestId !== this.selectedRequestId
            );

          this.filteredPlans =
            this.filteredPlans.filter(
              (x: any) =>
                x.dietPlanRequestId !== this.selectedRequestId
            );

          this.showDeletePopup = false;

        },

        error: (err) => {

          console.log('Delete Error:', err);

          this.showDeletePopup = false;

        }

      });
  }

}