import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DietPlan } from '../models/dietplan.model';
import { DietPlanRequest } from '../models/dietplanrequests.model';
import { environment } from 'environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DietplanService {

  private apiUrl = environment.apiUrl;
  private requestUrl = '';

  constructor (private http : HttpClient) { }
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAllDietPlans(): Observable<DietPlan[]> {
    return this.http.get<DietPlan[]>(
      `${this.apiUrl}/api/dietplan`,
      { headers: this.getHeaders() }
    );
  }

  deleteDietPlan(dietPlanId : string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/api/dietplan/${dietPlanId}`,
      { headers: this.getHeaders(), responseType: 'text' }
    );
  }

  getDietPlanById(id : string): Observable<DietPlan> {
    return this.http.get<DietPlan>(
      `${this.apiUrl}/api/dietplan/${id}`,
      { headers: this.getHeaders() }
    );
  }

  addDietPlan(dietPlan : DietPlan): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/dietplan`,
      dietPlan,
      { headers: this.getHeaders(), responseType: 'text' }
    );
  }

  updateDietPlan(id: string, dietPlan : DietPlan): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/api/dietplan/${id}`,
      dietPlan,
      { headers: this.getHeaders(), responseType: 'text' }
    );
  }

  getAppliedDietPlans(userId : string): Observable<DietPlanRequest[]> {
    return this.http.get<DietPlanRequest[]>(
      `${this.requestUrl}/api/dietplan/user/${userId}`,
      { headers: this.getHeaders() }
    );
  }

  addDietPlanRequest(
    request: DietPlanRequest
  ): Observable<any> {
  
    return this.http.post(
      `${this.apiUrl}/api/dietplanrequest`,
      request,
      {
        headers: this.getHeaders(),
        responseType: 'text'
      }
    );
  
  }


}