import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DashboardService } from '@core/services';
import { AttendeeSummary, AttendeeDetail } from '@core/models';
import { LoadingSpinnerComponent, ErrorMessageComponent } from '@shared/components';

@Component({
  selector: 'app-admin-attendees',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, ErrorMessageComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-6">
          <div class="flex items-center gap-4">
            <a [routerLink]="['/admin', eventSlug, 'dashboard']" class="text-gray-500 hover:text-gray-700">
              ← Volver
            </a>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">👥 Lista de Invitados Confirmados</h1>
              <p *ngIf="summary" class="text-gray-600">{{ summary.eventName }}</p>
            </div>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 py-8">
        <app-loading-spinner *ngIf="loading" />

        <app-error-message *ngIf="error" [error]="error" (retry)="loadSummary()" />

        <div *ngIf="!loading && !error && summary" class="space-y-6">
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div class="flex items-center gap-3">
                <span class="text-4xl">✅</span>
                <div>
                  <p class="text-3xl font-bold text-green-700">{{ summary.totalConfirmed }}</p>
                  <p class="text-sm text-green-600 font-medium">Confirmados</p>
                </div>
              </div>
            </div>
            <div class="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div class="flex items-center gap-3">
                <span class="text-4xl">👥</span>
                <div>
                  <p class="text-3xl font-bold text-blue-700">{{ calculateTotalCompanions() }}</p>
                  <p class="text-sm text-blue-600 font-medium">Acompañantes</p>
                </div>
              </div>
            </div>
            <div class="card bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div class="flex items-center gap-3">
                <span class="text-4xl">🎉</span>
                <div>
                  <p class="text-3xl font-bold text-purple-700">{{ summary.totalGuests }}</p>
                  <p class="text-sm text-purple-600 font-medium">Total de personas</p>
                </div>
              </div>
            </div>
            <div class="card bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
              <div class="flex items-center gap-3">
                <span class="text-4xl">📊</span>
                <div>
                  <p class="text-3xl font-bold text-amber-700">{{ calculateAverageCompanions() }}</p>
                  <p class="text-sm text-amber-600 font-medium">Promedio acompañantes</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Attendees Table -->
          <div class="card overflow-hidden">
            <div class="p-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 class="text-lg font-bold text-gray-800">Detalle de asistentes</h2>
                <p class="text-sm text-gray-500">Generado: {{ formatDate(summary.generatedAt) }}</p>
              </div>
              <div class="text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-full">
                {{ summary.attendees.length }} confirmaciones
              </div>
            </div>

            <div *ngIf="summary.attendees.length === 0" class="p-8 text-center">
              <p class="text-gray-500 text-lg">😊 Aún no hay invitados confirmados</p>
              <p class="text-gray-400 text-sm mt-2">
                Las confirmaciones aparecerán aquí cuando los invitados respondan
              </p>
            </div>

            <div *ngIf="summary.attendees.length > 0" class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Invitado
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acompañantes
                    </th>
                    <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total personas
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Notas
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Confirmado
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr *ngFor="let attendee of summary.attendees; let i = index" class="hover:bg-gray-50">
                    <td class="px-4 py-4 text-sm text-gray-500">{{ i + 1 }}</td>
                    <td class="px-4 py-4">
                      <div class="font-medium text-gray-900">{{ attendee.guestName || 'Sin nombre' }}</div>
                    </td>
                    <td class="px-4 py-4">
                      <div *ngIf="attendee.guestEmail" class="text-sm text-gray-600 flex items-center gap-1">
                        <span>📧</span> {{ attendee.guestEmail }}
                      </div>
                      <div *ngIf="attendee.guestPhone" class="text-sm text-gray-600 flex items-center gap-1">
                        <span>📱</span> {{ attendee.guestPhone }}
                      </div>
                      <div *ngIf="!attendee.guestEmail && !attendee.guestPhone" class="text-sm text-gray-400">
                        Sin contacto
                      </div>
                    </td>
                    <td class="px-4 py-4 text-center">
                      <span
                        class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm"
                      >
                        {{ (attendee.guestsCount || 1) - 1 }}
                      </span>
                    </td>
                    <td class="px-4 py-4 text-center">
                      <span
                        class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 font-bold text-sm"
                      >
                        {{ attendee.guestsCount || 1 }}
                      </span>
                    </td>
                    <td class="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {{ attendee.notes || '-' }}
                    </td>
                    <td class="px-4 py-4 text-sm text-gray-600">
                      {{ formatDate(attendee.createdAt) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-100">
                  <tr>
                    <td colspan="3" class="px-4 py-3 text-right font-bold text-gray-700">Total:</td>
                    <td class="px-4 py-3 text-center">
                      <span class="font-bold text-blue-700">{{ calculateTotalCompanions() }}</span>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <span class="font-bold text-green-700">{{ summary.totalGuests }}</span>
                    </td>
                    <td colspan="2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminAttendeesComponent implements OnInit {
  eventSlug = '';
  summary: AttendeeSummary | null = null;
  loading = true;
  error: any = null;

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.eventSlug = this.route.snapshot.paramMap.get('eventId') || '';
    this.loadSummary();
  }

  loadSummary(): void {
    this.loading = true;
    this.error = null;

    this.dashboardService.getAttendeesSummary(this.eventSlug).subscribe({
      next: data => {
        this.summary = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = {
          title: 'Error al cargar la lista',
          message: 'No pudimos obtener la lista de invitados confirmados.',
          icon: '😔'
        };
      }
    });
  }

  calculateTotalCompanions(): number {
    if (!this.summary) return 0;
    return this.summary.totalGuests - this.summary.totalConfirmed;
  }

  calculateAverageCompanions(): string {
    if (!this.summary || this.summary.totalConfirmed === 0) return '0';
    const companions = this.calculateTotalCompanions();
    const average = companions / this.summary.totalConfirmed;
    return average.toFixed(1);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
