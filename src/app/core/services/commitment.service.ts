import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Commitment } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CommitmentService {
  private readonly baseUrl = `${environment.apiUrl}/commitments`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/v1/commitments/{token}
   * Obtiene información de un compromiso por token
   */
  getCommitment(token: string): Observable<Commitment> {
    return this.http.get<Commitment>(`${this.baseUrl}/${token}`);
  }

  /**
   * DELETE /api/v1/commitments/{token}
   * Cancela un compromiso
   */
  cancelCommitment(token: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${token}`);
  }
}
