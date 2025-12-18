import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Dashboard } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly baseUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/v1/events/{eventSlug}/dashboard
   * Obtiene el dashboard completo del evento (Admin)
   */
  getDashboard(eventSlug: string): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.baseUrl}/${eventSlug}/dashboard`);
  }
}
