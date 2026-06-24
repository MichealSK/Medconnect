import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environments } from '../../environments/environment';
import { AvailabilitySlot, Doctor, DoctorsPage } from '../models/doctor';

@Injectable({
  providedIn: 'root',
})
export class DoctorsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environments.apiUrl}/doctors`;

  getAll(specialty?: string, language?: string) {
    let params = new HttpParams();
    if (specialty) params = params.set('specialty', specialty);
    if (language) params = params.set('language', language);
    return this.http.get<Doctor[]>(this.baseUrl, { params });
  }

  getAllPageable(
    specialty?: string,
    language?: string,
    search?: string,
    page: number = 0,
    size: number = 9,
  ) {
    let params = new HttpParams();
    if (specialty) params = params.set('specialty', specialty);
    if (language) params = params.set('language', language);
    if (search) params = params.set('search', search);
    params = params.set('page', page).set('size', size);
    return this.http.get<DoctorsPage>(`${this.baseUrl}/pageable`, { params });
  }
  getById(id: string) {
    return this.http.get<Doctor>(`${this.baseUrl}/${id}`);
  }

  getSlots(id: string) {
    return this.http.get<AvailabilitySlot[]>(`${this.baseUrl}/${id}/slots`);
  }
  getBookedSlots(id: string) {
    return this.http.get<string[]>(`${this.baseUrl}/${id}/slots/booked`);
  }
  getMyProfile() {
    return this.http.get<Doctor>(`${this.baseUrl}/me`);
  }
  addSlot(doctorId: string, request: { dayOfWeek: number; startTime: string; endTime: string }) {
    return this.http.post<AvailabilitySlot>(`${this.baseUrl}/${doctorId}/slots`, request);
  }

  deleteSlot(doctorId: string, slotId: string) {
    return this.http.delete<void>(`${this.baseUrl}/${doctorId}/slots/${slotId}`);
  }
  updateProfile(
    id: string,
    request: {
      specialty: string;
      bio: string;
      languages: string[];
      yearsExperience: number;
      timezone: string;
      profilePhotoUrl: string | null;
    },
  ) {
    return this.http.put<Doctor>(`${this.baseUrl}/${id}`, request);
  }
}
