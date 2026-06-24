import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environments } from '../../environments/environment';

export interface ReviewRequest {
  appointmentId: string;
  rating: number;
  comment: string | null;
}

export interface ReviewResponse {
  id: string;
  appointmentId: string;
  patientName: string;
  doctorId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environments.apiUrl}/doctors`;

  submitReview(doctorId: string, request: ReviewRequest) {
    return this.http.post<ReviewResponse>(`${this.baseUrl}/${doctorId}/reviews`, request);
  }

  getReviews(doctorId: string) {
    return this.http.get<ReviewResponse[]>(`${this.baseUrl}/${doctorId}/reviews`);
  }
}
