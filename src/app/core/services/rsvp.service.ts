import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { RSVP, CreateRSVPRequest, Attendee, RSVPStatus } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RsvpService {
  private readonly baseUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  /**
   * POST /api/v1/events/{eventId}/rsvp
   * Confirma asistencia al evento
   */
  createRSVP(eventSlug: string, request: CreateRSVPRequest): Observable<{ token: string; rsvp: RSVP }> {
    return this.http.post<{ token: string; rsvp: RSVP }>(`${this.baseUrl}/${eventSlug}/rsvp`, request);
  }

  /**
   * GET /api/v1/events/{eventId}/rsvps
   * Obtiene todas las respuestas de asistencia (Admin)
   */
  getRSVPs(eventSlug: string, status?: RSVPStatus): Observable<RSVP[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<RSVP[]>(`${this.baseUrl}/${eventSlug}/rsvps`, { params });
  }

  /**
   * GET /api/v1/events/{eventId}/attendees
   * Obtiene lista de asistentes confirmados (Admin)
   */
  getAttendees(eventSlug: string, status: RSVPStatus = RSVPStatus.CONFIRMED): Observable<Attendee[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<Attendee[]>(`${this.baseUrl}/${eventSlug}/attendees`, { params });
  }
}
