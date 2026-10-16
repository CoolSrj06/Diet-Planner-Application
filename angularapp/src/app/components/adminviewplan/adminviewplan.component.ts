import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DietplanService } from '../../services/dietplan.service';
import { DietPlan } from '../../models/dietplan.model';
import { DietplanrequestService } from 'src/app/services/dietplanrequest.service';

@Component({
  selector: 'app-adminviewplan',
  templateUrl: './adminviewplan.component.html',
  styleUrls: ['./adminviewplan.component.css']
})
export class AdminviewplanComponent implements OnInit {

  searchText = '';

  dietPlans: DietPlan[] = [];
  filteredPlans: DietPlan[] = [];
  enrolledPlanIds: number[] = [];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  paginatedPlans: DietPlan[] = [];
  totalPages: number = 0;

  isLoadingPlans: boolean = false;

  // Enrolled Users Popup
  showEnrolledPopup = false;
  enrolledUsers: any[] = [];

  // Delete Popup
  showDeletePopup: boolean = false;
  selectedPlanId: number = 0;

  constructor(
    private router: Router,
    private dietplanService: DietplanService,
    private dietPlanRequestService: DietplanrequestService
  ) { }

  ngOnInit(): void {
    this.loadDietPlans();
    this.loadEnrolledPlans();
  }

  loadDietPlans(): void {

    this.isLoadingPlans = true;

    this.dietplanService.getAllDietPlans().subscribe({

      next: (data) => {

        this.dietPlans = data;
        this.filteredPlans = [...data];

        this.updatePagination();

        this.isLoadingPlans = false;

        console.log(data);
      },

      error: (err) => {

        console.error('Error loading diet plans', err);

        this.isLoadingPlans = false;
      }

    });
  }

  searchPlans(): void {

    const search = this.searchText.toLowerCase();

    this.filteredPlans = this.dietPlans.filter(plan =>

      plan.planName.toLowerCase().includes(search) ||

      plan.description.toLowerCase().includes(search)

    );

    this.currentPage = 1;

    this.updatePagination();
  }

  editPlan(id: number): void {

    this.router.navigate(['/admineditplan', id]);
  }

  /* =====================================
      DELETE POPUP METHODS
  ===================================== */

  openDeletePopup(id: number): void {

    this.selectedPlanId = id;

    this.showDeletePopup = true;
  }

  cancelDelete(): void {

    this.showDeletePopup = false;

    this.selectedPlanId = 0;
  }

  confirmDelete(): void {

    const id = this.selectedPlanId;

    this.dietplanService.deleteDietPlan(id.toString())
      .subscribe({

        next: () => {

          this.dietPlans = this.dietPlans.filter(
            plan => plan.dietPlanId !== id
          );

          this.filteredPlans = this.filteredPlans.filter(
            plan => plan.dietPlanId !== id
          );

          this.dietPlans = [...this.dietPlans];
          this.filteredPlans = [...this.filteredPlans];

          this.updatePagination();

          this.showDeletePopup = false;

          this.selectedPlanId = 0;
        },

        error: (err) => {

          console.error('Delete failed', err);

          this.showDeletePopup = false;
        }

      });
  }

  loadEnrolledPlans(): void {

    this.dietPlanRequestService
      .getAllPlanRequests()
      .subscribe({

        next: (data: any) => {

          const requests = Array.isArray(data)
            ? data
            : [data];

          this.enrolledPlanIds = [

            ...new Set(

              requests

                .filter(
                  (x: any) => x.status === 'Approved'
                )

                .map(
                  (x: any) => x.dietPlanId
                )

            )

          ];

          console.log(
            'Enrolled Plan IDs:',
            this.enrolledPlanIds
          );
        },

        error: (err) => {

          console.error(err);
        }

      });
  }

  isEnrolled(planId: number): boolean {

    return this.enrolledPlanIds.includes(planId);
  }

  viewEnrolledUsers(planId: number): void {

    console.log('Selected Plan:', planId);

    this.dietPlanRequestService
      .getEnrolledUsers(planId.toString())
      .subscribe({

        next: (data: any) => {

          console.log('Users Response:', data);

          this.enrolledUsers = data;

          this.showEnrolledPopup = true;
        },

        error: (err) => {

          console.log('Error:', err);
        }

      });
  }

  closePopup(): void {

    this.showEnrolledPopup = false;
  }

  logout(): void {

    localStorage.clear();

    this.router.navigate(['/login']);
  }

  updatePagination(): void {

    this.totalPages = Math.ceil(
      this.filteredPlans.length / this.itemsPerPage
    );

    const startIndex =
      (this.currentPage - 1) * this.itemsPerPage;

    const endIndex =
      startIndex + this.itemsPerPage;

    this.paginatedPlans =
      this.filteredPlans.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {

    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;

    this.updatePagination();
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

  get pages(): number[] {

    return Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );
  }

}