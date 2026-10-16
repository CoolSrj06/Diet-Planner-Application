import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DietPlanRequest } from '../models/dietplanrequests.model';
import { environment } from 'environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DietplanrequestService {
  public apiUrl = `${environment.apiUrl}`;
  
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  addDietPlanRequest(data: DietPlanRequest): Observable<any> {
    return this.http.post<any>(
      this.apiUrl,
      data,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Get all diet plan requests applied by a specific user
   */
  getAppliedPlans(userId: string): Observable<DietPlanRequest[]> {
    return this.http.get<DietPlanRequest[]>(
      `${this.apiUrl}/api/dietplanrequest/user/${userId}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Delete a diet plan application by request ID
   */
  deletePlanApplication(requestedId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/api/dietplanrequest/${requestedId}`,
      {
        headers: this.getHeaders(),
        responseType: 'text'
      }
    );
  }

  /**
   * Get all diet plan requests
   */
  getAllPlanRequests(): Observable<DietPlanRequest[]> {
    return this.http.get<DietPlanRequest[]>(
      `${this.apiUrl}/api/dietplanrequest`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Update diet plan request status
   */
  updatePlanStatus(
    id: string,
    planApplication: DietPlanRequest
  ): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/api/dietplanrequest/${id}`,
      planApplication,
      { headers: this.getHeaders() }
    );
  }

  // Get User Name by User ID
  getUserNameByUserId(userId: number): Observable<{ username: string }> {
    return this.http.get<{ username: string }>(
      `${this.apiUrl}/api/dietplanrequest/username/${userId}`,
      { headers: this.getHeaders() }
    );
  }

  getEnrolledUsers(planId: string) {
    return this.http.get<any[]>(
      `${environment.apiUrl}/api/dietplan/${planId}/enrolledusers`,
      {
        headers: this.getHeaders()
      }
    );
  }
}