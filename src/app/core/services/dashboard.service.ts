import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Dashboard, GiftReservationReport, AttendeeSummary } from '../models';

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

  /**
   * GET /api/v1/events/{eventSlug}/gifts/reservations/report
   * Obtiene el reporte de regalos reservados con información del reservador
   */
  getGiftReservationsReport(eventSlug: string): Observable<GiftReservationReport> {
    return this.http.get<GiftReservationReport>(`${this.baseUrl}/${eventSlug}/gifts/reservations/report`);
  }

  /**
   * GET /api/v1/events/{eventSlug}/attendees/summary
   * Obtiene el resumen de asistentes con total de acompañantes
   */
  getAttendeesSummary(eventSlug: string): Observable<AttendeeSummary> {
    return this.http.get<AttendeeSummary>(`${this.baseUrl}/${eventSlug}/attendees/summary`);
  }
}
