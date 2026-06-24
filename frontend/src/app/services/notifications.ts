import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environments } from '../../environments/environment';

export interface NotificationResponse {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environments.apiUrl}/notifications`;

  getAll() {
    return this.http.get<NotificationResponse[]>(this.baseUrl);
  }

  markAsRead(id: string) {
    return this.http.put<void>(`${this.baseUrl}/${id}/read`, {});
  }

  markAllAsRead() {
    return this.http.put<void>(`${this.baseUrl}/read-all`, {});
  }
}
