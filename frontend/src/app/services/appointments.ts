import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environments } from '../../environments/environment';

export interface AppointmentRequest {
  doctorId: string;
  scheduledAt: string;
  durationMinutes: number;
}

export interface AppointmentResponse {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  scheduledAt: string;
  durationMinutes: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  jitsiRoom: string | null;
  jitsiUrl: string | null;
  createdAt: string;
}

export interface SymptomFormRequest {
  symptomsText: string;
  durationDays: number | null;
  severity: number | null;
  medications: string | null;
  knownConditions: string | null;
}

export interface SymptomFormResponse {
  id: string;
  appointmentId: string;
  symptomsText: string;
  durationDays: number | null;
  severity: number | null;
  medications: string | null;
  knownConditions: string | null;
  aiBrief: string | null;
  createdAt: string;
}

export interface AppointmentNotesRequest {
  notesText: string;
}

export interface AppointmentNotesResponse {
  id: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  notesText: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environments.apiUrl}/appointments`;

  book(request: AppointmentRequest) {
    return this.http.post<AppointmentResponse>(this.baseUrl, request);
  }

  getAll() {
    return this.http.get<AppointmentResponse[]>(this.baseUrl);
  }

  getById(id: string) {
    return this.http.get<AppointmentResponse>(`${this.baseUrl}/${id}`);
  }

  cancel(id: string) {
    return this.http.put<void>(`${this.baseUrl}/${id}/cancel`, {});
  }

  submitSymptomForm(appointmentId: string, request: SymptomFormRequest) {
    return this.http.post<SymptomFormResponse>(
      `${this.baseUrl}/${appointmentId}/symptom-form`,
      request,
    );
  }

  getSymptomForm(appointmentId: string) {
    return this.http.get<SymptomFormResponse>(`${this.baseUrl}/${appointmentId}/symptom-form`);
  }

  getNotes(appointmentId: string) {
    return this.http.get<AppointmentNotesResponse>(`${this.baseUrl}/${appointmentId}/notes`);
  }

  saveNotes(appointmentId: string, request: AppointmentNotesRequest) {
    return this.http.post<AppointmentNotesResponse>(
      `${this.baseUrl}/${appointmentId}/notes`,
      request,
    );
  }
}
