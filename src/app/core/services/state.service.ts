import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event } from '../models';

/**
 * Servicio de estado global ligero usando RxJS
 */
@Injectable({
  providedIn: 'root'
})
export class StateService {
  // Estado del evento actual
  private currentEventSubject = new BehaviorSubject<Event | null>(null);
  public currentEvent$: Observable<Event | null> = this.currentEventSubject.asObservable();

  // Estado de loading global
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  // Tokens de compromisos (para mostrar confirmaciones)
  private commitmentsSubject = new BehaviorSubject<string[]>([]);
  public commitments$: Observable<string[]> = this.commitmentsSubject.asObservable();

  /**
   * Establece el evento actual
   */
  setCurrentEvent(event: Event | null): void {
    if (event) {
      const enrichedEvent: Event = {
        ...event,
        // Algunos backends no envían babyName; usamos name como respaldo.
        babyName: event.babyName || event.name
      };
      this.currentEventSubject.next(enrichedEvent);
    } else {
      this.currentEventSubject.next(null);
    }
  }

  /**
   * Obtiene el evento actual (snapshot)
   */
  getCurrentEvent(): Event | null {
    return this.currentEventSubject.value;
  }

  /**
   * Establece el estado de loading
   */
  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  /**
   * Agrega un token de compromiso
   */
  addCommitment(token: string): void {
    const current = this.commitmentsSubject.value;
    if (!current.includes(token)) {
      this.commitmentsSubject.next([...current, token]);
      // Guardar en localStorage también
      localStorage.setItem('baby_shower_commitments', JSON.stringify([...current, token]));
    }
  }

  /**
   * Obtiene los tokens de compromisos guardados
   */
  loadCommitmentsFromStorage(): void {
    const stored = localStorage.getItem('baby_shower_commitments');
    if (stored) {
      try {
        const tokens = JSON.parse(stored);
        this.commitmentsSubject.next(tokens);
      } catch (e) {
        console.error('Error loading commitments from storage', e);
      }
    }
  }

  /**
   * Limpia todos los compromisos
   */
  clearCommitments(): void {
    this.commitmentsSubject.next([]);
    localStorage.removeItem('baby_shower_commitments');
  }
}
