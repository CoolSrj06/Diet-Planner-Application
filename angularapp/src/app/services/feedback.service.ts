import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback } from '../models/feedback.model';
import { environment } from 'environment/environment';


@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Send feedback
   */
  sendFeedback(feedback: Feedback): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/Feedback`,
      feedback,
      { headers: this.getHeaders(),
        responseType: 'text'
      }
    );
  }

  /**
   * Get all feedbacks submitted by a specific user
   */
  getAllFeedbacksByUserId(userId: string): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(
      `${this.apiUrl}/api/Feedback/user/${userId}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Delete feedback by ID
   */
  deleteFeedback(feedbackId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/api/Feedback/${feedbackId}`,
      { headers: this.getHeaders(),
        responseType: 'text'
      
      }
    );
  }

  /**
   * Get all feedbacks
   */
  getFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(
      `${this.apiUrl}/api/Feedback`,
      { headers: this.getHeaders() }
    );
  }

  getUserNameByUserId(userId: number): Observable<{ username: string }> {
    return this.http.get<{ username: string }>(`${this.apiUrl}/api/Feedback/username/${userId}`, {
      headers: this.getHeaders()
    });
  }

  // Method 2: Get Full User Details by User ID
  getUserDetailsByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/Feedback/userdetails/${userId}`, {
      headers: this.getHeaders()
    });
  }
}