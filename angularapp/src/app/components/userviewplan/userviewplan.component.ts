import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DietplanService } from '../../services/dietplan.service';
import { DietPlan } from '../../models/dietplan.model';
import { DietplanrequestService } from 'src/app/services/dietplanrequest.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-userviewplan',
  templateUrl: './userviewplan.component.html',
  styleUrls: ['./userviewplan.component.css']
})
export class UserviewplanComponent implements OnInit {

  searchText = '';

  plans: DietPlan[] = [];
  filteredPlans: DietPlan[] = [];
  appliedPlanIds: number[] = [];

  paginatedPlans: DietPlan[] = [];

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;

  isLoading = true;

  showPopup = false;
  popupTitle = '';
  popupMessage = '';

  constructor(
    private router: Router,
    private dietplanService: DietplanService,
    private dietPlanRequestService: DietplanrequestService
  ) { }

  ngOnInit(): void {

    this.loadPlans();

    this.loadAppliedPlans();

  }

  loadPlans(): void {

    this.isLoading = true;

    this.dietplanService
      .getAllDietPlans()
      .subscribe({

        next: (data) => {

          console.log('API Response:', data);

          this.plans = data;
          this.filteredPlans = data;

          this.currentPage = 1;

          this.updatePagination();

          this.isLoading = false;

        },

        error: (err) => {

          console.error(
            'Error loading plans',
            err
          );

          this.isLoading = false;

        }

      });

  }

  searchPlans(): void {

    const value =
      this.searchText.toLowerCase();

    this.filteredPlans =
      this.plans.filter(plan =>

        plan.planName
          .toLowerCase()
          .includes(value)

        ||

        plan.description
          .toLowerCase()
          .includes(value)

      );

    this.currentPage = 1;

    this.updatePagination();

  }

  applyPlan(plan: DietPlan): void {

    const token =
      localStorage.getItem('token');

    if (!token) {
      return;
    }

    const decoded: any =
      jwtDecode(token);

    const userId =
      decoded.UserId;

    this.dietPlanRequestService
      .getAppliedPlans(userId.toString())
      .subscribe({

        next: (data: any) => {

          const requests =
            Array.isArray(data)
              ? data
              : (data ? [data] : []);

          const hasActiveRequest =
            requests.some((request: any) => {

              const status =
                (
                  request.status ??
                  request.Status ??
                  ''
                )
                  .toString()
                  .trim()
                  .toLowerCase();

              return (
                status === 'pending' ||
                status === 'approved'
              );

            });

          if (hasActiveRequest) {

            this.popupTitle =
              'Diet Plan Already Exists';

            this.popupMessage =
              'You already have a pending request or an approved diet plan. Kindly delete or unenroll from your current diet plan before applying for another diet plan.';

            this.showPopup = true;

            return;

          }

          this.router.navigate([
            '/userplanform',
            plan.dietPlanId
          ]);

        },

        error: (err) => {

          console.error(
            'Error checking existing requests',
            err
          );

        }

      });

  }

  closePopup(): void {

    this.showPopup = false;

  }

  logout(): void {

    localStorage.clear();

    this.router.navigate([
      '/login'
    ]);

  }

  loadAppliedPlans(): void {

    const token =
      localStorage.getItem('token');

    if (!token) {
      return;
    }

    const decoded: any =
      jwtDecode(token);

    const userId =
      decoded.UserId;

    this.dietPlanRequestService
      .getAppliedPlans(userId.toString())
      .subscribe({

        next: (data: any) => {

          console.log(
            'Applied API Response:',
            data
          );

          const requests =
            Array.isArray(data)
              ? data
              : [data];

          this.appliedPlanIds =
            requests.map((request: any) =>
              request.dietPlanId ??
              request.DietPlanId
            );

          console.log(
            'Applied IDs:',
            this.appliedPlanIds
          );

        },

        error: (err) => {

          console.error(
            'Error loading applied plans',
            err
          );

        }

      });

  }

  isApplied(planId: number): boolean {

    return this.appliedPlanIds.includes(
      planId
    );

  }

  updatePagination(): void {

    this.totalPages =
      Math.ceil(
        this.filteredPlans.length /
        this.itemsPerPage
      );

    const startIndex =
      (this.currentPage - 1) *
      this.itemsPerPage;

    const endIndex =
      startIndex +
      this.itemsPerPage;

    this.paginatedPlans =
      this.filteredPlans.slice(
        startIndex,
        endIndex
      );

  }

  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

      this.updatePagination();

    }

  }

  previousPage(): void {

    if (
      this.currentPage > 1
    ) {

      this.currentPage--;

      this.updatePagination();

    }

  }

}