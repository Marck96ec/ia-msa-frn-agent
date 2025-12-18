import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Event, CreateEventRequest, UpdateEventRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly baseUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/v1/events/{slug}
   * Obtiene información del evento por slug
   */
  getEventBySlug(slug: string): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}/${slug}`);
  }

  /**
   * POST /api/v1/events
   * Crea un nuevo evento (Admin)
   */
  createEvent(request: CreateEventRequest): Observable<Event> {
    return this.http.post<Event>(this.baseUrl, request);
  }

  /**
   * PUT /api/v1/events/{eventId}
   * Actualiza un evento existente (Admin)
   */
  updateEvent(eventId: number | string, request: UpdateEventRequest): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}/${eventId}`, request);
  }
}
