import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Idea, CreateIdeaRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class IdeaService {
  private readonly baseUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  /**
   * POST /api/v1/events/{eventSlug}/ideas
   * Envía una sugerencia de colaboración
   */
  createIdea(eventSlug: string, request: CreateIdeaRequest): Observable<Idea> {
    return this.http.post<Idea>(`${this.baseUrl}/${eventSlug}/ideas`, request);
  }

  /**
   * GET /api/v1/events/{eventSlug}/ideas
   * Obtiene todas las ideas del evento (Admin)
   */
  getIdeas(eventSlug: string): Observable<Idea[]> {
    return this.http.get<Idea[]>(`${this.baseUrl}/${eventSlug}/ideas`);
  }
}
