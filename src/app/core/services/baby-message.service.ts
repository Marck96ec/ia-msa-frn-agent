import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { BabyMessage, CreateBabyMessageRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BabyMessageService {
  private readonly baseUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  /**
   * POST /api/v1/events/{eventSlug}/baby-messages
   * Envía un mensaje para el bebé
   */
  createBabyMessage(eventSlug: string, request: CreateBabyMessageRequest): Observable<BabyMessage> {
    return this.http.post<BabyMessage>(`${this.baseUrl}/${eventSlug}/baby-messages`, request);
  }

  /**
   * GET /api/v1/events/{eventSlug}/baby-messages
   * Obtiene todos los mensajes para el bebé (Admin)
   */
  getBabyMessages(eventSlug: string): Observable<BabyMessage[]> {
    return this.http.get<BabyMessage[]>(`${this.baseUrl}/${eventSlug}/baby-messages`);
  }
}
