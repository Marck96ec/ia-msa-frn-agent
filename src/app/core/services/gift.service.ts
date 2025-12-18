import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
  Gift,
  CreateGiftRequest,
  UpdateGiftRequest,
  ReserveGiftRequest,
  ContributeGiftRequest,
  ImportGiftsRequest,
  GiftSummary,
  CommitmentResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class GiftService {
  private readonly baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/v1/events/{slug}/gifts
   * Obtiene lista de regalos del evento
   */
  getEventGifts(slug: string, status?: string): Observable<Gift[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Gift[]>(`${this.baseUrl}/events/${slug}/gifts`, { params });
  }

  /**
   * GET /api/v1/gifts/{giftId}
   * Obtiene detalle de un regalo específico
   */
  getGiftById(giftId: string): Observable<Gift> {
    return this.http.get<Gift>(`${this.baseUrl}/gifts/${giftId}`);
  }

  /**
   * POST /api/v1/gifts/{giftId}/reserve
   * Reserva un regalo completo
   */
  reserveGift(giftId: string, request: ReserveGiftRequest): Observable<CommitmentResponse> {
    return this.http.post<CommitmentResponse>(`${this.baseUrl}/gifts/${giftId}/reserve`, request);
  }

  /**
   * POST /api/v1/gifts/{giftId}/contribute
   * Aporta un monto a un regalo compartido
   */
  contributeToGift(giftId: string, request: ContributeGiftRequest): Observable<CommitmentResponse> {
    return this.http.post<CommitmentResponse>(`${this.baseUrl}/gifts/${giftId}/contribute`, request);
  }

  /**
   * POST /api/v1/events/{eventId}/gifts
   * Crea un nuevo regalo (Admin)
   */
  createGift(eventSlug: string, request: CreateGiftRequest): Observable<Gift> {
    return this.http.post<Gift>(`${this.baseUrl}/events/${eventSlug}/gifts`, request);
  }

  /**
   * POST /api/v1/events/{eventId}/gifts/import
   * Importa múltiples regalos (Admin)
   */
  importGifts(eventSlug: string, request: ImportGiftsRequest): Observable<{ imported: number; gifts: Gift[] }> {
    return this.http.post<{ imported: number; gifts: Gift[] }>(
      `${this.baseUrl}/events/${eventSlug}/gifts/import`,
      request
    );
  }

  /**
   * PUT /api/v1/gifts/{giftId}
   * Actualiza un regalo (Admin)
   */
  updateGift(giftId: string, request: UpdateGiftRequest): Observable<Gift> {
    return this.http.put<Gift>(`${this.baseUrl}/gifts/${giftId}`, request);
  }

  /**
   * DELETE /api/v1/gifts/{giftId}
   * Elimina un regalo (Admin)
   */
  deleteGift(giftId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/gifts/${giftId}`);
  }

  /**
   * GET /api/v1/events/{eventId}/gifts/summary
   * Obtiene resumen de regalos (Admin)
   */
  getGiftsSummary(eventSlug: string): Observable<GiftSummary> {
    return this.http.get<GiftSummary>(`${this.baseUrl}/events/${eventSlug}/gifts/summary`);
  }
}
