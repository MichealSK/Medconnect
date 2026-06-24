import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environments } from '../../environments/environment';
import { PlatformStats } from '../models/stats';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environments.apiUrl}/stats`;

  getPlatformStats() {
    return this.http.get<PlatformStats>(this.baseUrl);
  }
}
