import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ChatRequest, ChatResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly baseUrl = `${environment.apiUrl}/chat`;

  constructor(private http: HttpClient) {}

  /**
   * POST /api/v1/chat
   * Envía un mensaje al asistente MCG
   */
  sendMessage(request: ChatRequest): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.baseUrl, request);
  }

  /**
   * GET /api/v1/chat/simple?message={prompt}
   * Obtiene una respuesta simple en texto plano
   */
  getSimpleMessage(prompt: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/simple`, {
      params: { message: prompt },
      responseType: 'text'
    });
  }
}
