import { Component, OnInit } from '@angular/core';

import { DietplanService } from 'src/app/services/dietplan.service';

import { DietplanrequestService } from 'src/app/services/dietplanrequest.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({

  selector: 'app-requestedplan',

  templateUrl: './requestedplan.component.html',

  styleUrls: ['./requestedplan.component.css']

})

export class RequestedplanComponent implements OnInit {


  requests: any[] = [];

  filteredRequests: any[] = [];

  paginatedRequests: any[] = [];


  userNamesMap: { [userId: number]: string } = {};


  isLoadingRequests: boolean = false;

  isLoadingPlanDetails: boolean = false;


  currentPage = 1;

  itemsPerPage = 5;

  totalPages = 0;


  searchText: string = '';

  selectedStatus: string = 'All';


  pendingCount: number = 0;


  showModal: boolean = false;


  selectedDietPlan: any = {

    dietPlanId: 0,

    planName: '',

    description: '',

    duration: 0

  };


  constructor(

    private dietplanrequestService: DietplanrequestService,
    private dietplanService: DietplanService,
    private notificationService: NotificationService
  ) { }


  ngOnInit(): void {

    this.loadRequests();

  }


  getStatus(plan: any): string {


    const rawStatus = plan?.status ?? plan?.Status;


    if (!rawStatus) {

      return 'Pending';

    }


    const statusLower = rawStatus

      .toString()

      .trim()

      .toLowerCase();


    if (statusLower === 'approved') {

      return 'Approved';

    }


    if (statusLower === 'rejected') {

      return 'Rejected';

    }


    return 'Pending';

  }


  updatePendingCount(): void {


    this.pendingCount = this.requests.filter(

      request => this.getStatus(request) === 'Pending'

    ).length;

    this.notificationService.updatePendingCount(
      this.pendingCount
    );

  }


  loadRequests(): void {


    this.isLoadingRequests = true;


    this.dietplanrequestService

      .getAllPlanRequests()

      .subscribe({


        next: (data: any[]) => {


          console.log('Diet Requests:', data);


          this.requests = Array.isArray(data)

            ? data

            : [];


          this.filteredRequests = [...this.requests];


          this.updatePendingCount();


          this.requests.forEach(plan => {


            const userId =

              plan.userId ?? plan.UserId;


            if (

              userId &&

              !this.userNamesMap[userId]

            ) {

              this.fetchUserName(userId);

            }


          });


          this.currentPage = 1;


          this.searchPlans();


          this.isLoadingRequests = false;

        },


        error: (err) => {


          console.error(

            'Error loading requests:',

            err

          );


          this.isLoadingRequests = false;

        }


      });


  }


  fetchUserName(userId: number): void {


    this.dietplanrequestService

      .getUserNameByUserId(userId)

      .subscribe({


        next: (res: { username: string }) => {


          this.userNamesMap[userId] =

            res.username;


        },


        error: () => {

          this.userNamesMap[userId] =
            'User';

        }


      });


  }


  getUsername(plan: any): string {


    if (plan.user?.username) {

      return plan.user.username;

    }


    if (plan.user?.userName) {

      return plan.user.userName;

    }


    if (plan.User?.Username) {

      return plan.User.Username;

    }


    const userId =

      plan.userId ?? plan.UserId;


    if (

      userId !== undefined &&

      userId !== null &&

      this.userNamesMap[userId]

    ) {


      return this.userNamesMap[userId];


    }


    return 'Loading...';


  }


  getPlanName(plan: any): string {


    return (

      plan.dietPlan?.planName ??

      plan.DietPlan?.PlanName ??

      plan.planName ??

      'Unknown Plan'

    );


  }


  searchPlans(): void {


    this.filteredRequests =

      this.requests.filter(plan => {


        const planName =

          this.getPlanName(plan)

            .toLowerCase();


        const goalValue =

          (

            plan.goal ??

            plan.Goal ??

            ''

          )

            .toString()

            .toLowerCase();


        const currentStatus =

          this.getStatus(plan);


        const search =

          this.searchText.toLowerCase();


        const matchesSearch =

          planName.includes(search) ||

          goalValue.includes(search);


        const matchesStatus =

          this.selectedStatus === 'All' ||

          currentStatus.toLowerCase() ===

          this.selectedStatus.toLowerCase();


        return (

          matchesSearch &&

          matchesStatus

        );


      });


    this.currentPage = 1;


    this.updatePagination();


  }


  filterStatus(): void {


    this.currentPage = 1;


    this.searchPlans();


  }


  approvePlan(plan: any): void {


    plan.status = 'Approved';

    plan.Status = 'Approved';


    const requestId =

      plan.dietPlanRequestId ??

      plan.DietPlanRequestId;


    this.dietplanrequestService

      .updatePlanStatus(

        requestId,

        plan

      )

      .subscribe({


        next: () => {


          this.loadRequests();


        },


        error: (err) => {


          console.error(

            'Error approving plan:',

            err

          );


        }


      });


  }


  rejectPlan(plan: any): void {


    plan.status = 'Rejected';

    plan.Status = 'Rejected';


    const requestId =

      plan.dietPlanRequestId ??

      plan.DietPlanRequestId;


    this.dietplanrequestService

      .updatePlanStatus(

        requestId,

        plan

      )

      .subscribe({


        next: () => {


          this.loadRequests();


        },


        error: (err) => {


          console.error(

            'Error rejecting plan:',

            err

          );


        }


      });


  }


  showDetails(dietPlanId: any): void {


    this.showModal = true;


    this.isLoadingPlanDetails = true;


    this.dietplanService

      .getDietPlanById(

        dietPlanId

      )

      .subscribe({


        next: (data) => {


          this.selectedDietPlan = data;


          this.isLoadingPlanDetails = false;


        },


        error: (err) => {


          console.error(

            'Error fetching plan details:',

            err

          );


          this.isLoadingPlanDetails = false;


        }


      });


  }


  closeModal(): void {


    this.showModal = false;


  }


  updatePagination(): void {


    this.totalPages = Math.ceil(

      this.filteredRequests.length /

      this.itemsPerPage

    );


    const startIndex =

      (this.currentPage - 1) *

      this.itemsPerPage;


    const endIndex =

      startIndex +

      this.itemsPerPage;


    this.paginatedRequests =

      this.filteredRequests.slice(

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
 