import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router) {}

  onGetStarted(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/register']);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      
      // Extract role from JWT claims (adjust property key if your token uses 'role' or 'userRole')
      const userRole = decoded.role || decoded.Role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      if (userRole && userRole.toLowerCase() === 'admin') {
        // Redirect Admin to the Admin View Plans page
        this.router.navigate(['/adminviewplan']); // Update path if your admin route name is different
      } else {
        // Redirect regular User to the User View Plans page
        this.router.navigate(['/userviewplan']);
      }
    } catch (error) {
      console.error('Error decoding token', error);
      this.router.navigate(['/register']);
    }
  }

}