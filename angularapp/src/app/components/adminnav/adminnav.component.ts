import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

import { DietplanrequestService } from 'src/app/services/dietplanrequest.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({

  selector: 'app-adminnav',

  templateUrl: './adminnav.component.html',

  styleUrls: ['./adminnav.component.css']

})

export class AdminnavComponent implements OnInit {


  showDropdown = false;


  username: string = '';


  pendingRequestCount: number = 0;


  constructor(

    private router: Router,

    private authService: AuthService,
    private dietplanrequestService: DietplanrequestService,
    private notificationService: NotificationService
  ) { }


  ngOnInit(): void {


    this.username =

      this.authService.getUsernameFromToken();


    this.loadPendingRequests();

    this.notificationService
      .pendingCount$
      .subscribe(count => {

        this.pendingRequestCount = count;

      });

  }


  loadPendingRequests(): void {


    this.dietplanrequestService

      .getAllPlanRequests()

      .subscribe({


        next: (data: any[]) => {

          const count = data.filter(x => {

            const status =

              (x.status ?? x.Status ?? '')

                .toString()

                .trim()

                .toLowerCase();


            return status === 'pending';


          }).length;

          this.pendingRequestCount = count;

          this.notificationService
            .updatePendingCount(count);

        },


        error: (err) => {


          console.error(

            'Error loading request count',

            err

          );


        }


      });


  }

  toggleDropdown(): void {

    this.showDropdown =
      !this.showDropdown;

  }

  logout(): void {

    localStorage.removeItem('token');


    this.router.navigate(['']);

  }


}
 