import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DashboardService } from '@core/services';
import { GiftReservationReport, CommitmentType } from '@core/models';
import { LoadingSpinnerComponent, ErrorMessageComponent } from '@shared/components';

@Component({
  selector: 'app-admin-gifts-report',
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
              <h1 class="text-2xl font-bold text-gray-900">🎁 Reporte de Regalos Reservados</h1>
              <p *ngIf="report" class="text-gray-600">{{ report.eventName }}</p>
            </div>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 py-8">
        <app-loading-spinner *ngIf="loading" />

        <app-error-message *ngIf="error" [error]="error" (retry)="loadReport()" />

        <div *ngIf="!loading && !error && report" class="space-y-6">
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="card">
              <div class="flex items-center gap-3">
                <span class="text-3xl">📦</span>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ report.totalRecords }}</p>
                  <p class="text-sm text-gray-600">Regalos reservados/aportados</p>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="flex items-center gap-3">
                <span class="text-3xl">🎯</span>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ countFullReservations() }}</p>
                  <p class="text-sm text-gray-600">Reservas completas</p>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="flex items-center gap-3">
                <span class="text-3xl">💝</span>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ countContributions() }}</p>
                  <p class="text-sm text-gray-600">Aportes parciales</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Gifts Table -->
          <div class="card overflow-hidden">
            <div class="p-4 border-b border-gray-200">
              <h2 class="text-lg font-bold text-gray-800">Listado de reservas</h2>
              <p class="text-sm text-gray-500">Generado: {{ formatDate(report.generatedAt) }}</p>
            </div>

            <div *ngIf="report.items.length === 0" class="p-8 text-center">
              <p class="text-gray-500 text-lg">😊 Aún no hay regalos reservados</p>
              <p class="text-gray-400 text-sm mt-2">Los regalos aparecerán aquí cuando los invitados los reserven</p>
            </div>

            <div *ngIf="report.items.length > 0" class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Regalo
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Estado
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Reservado por
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Monto
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr *ngFor="let item of report.items" class="hover:bg-gray-50">
                    <td class="px-4 py-4">
                      <div class="font-medium text-gray-900">{{ item.giftName }}</div>
                      <div *ngIf="item.notes" class="text-xs text-gray-500 mt-1">{{ item.notes }}</div>
                    </td>
                    <td class="px-4 py-4">
                      <span
                        [class]="getStatusClass(item.giftStatus)"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {{ getStatusLabel(item.giftStatus) }}
                      </span>
                    </td>
                    <td class="px-4 py-4">
                      <div class="font-medium text-gray-900">{{ item.reserverName || 'Anónimo' }}</div>
                    </td>
                    <td class="px-4 py-4">
                      <div *ngIf="item.reserverEmail" class="text-sm text-gray-600">📧 {{ item.reserverEmail }}</div>
                      <div *ngIf="item.reserverPhone" class="text-sm text-gray-600">📱 {{ item.reserverPhone }}</div>
                      <div *ngIf="!item.reserverEmail && !item.reserverPhone" class="text-sm text-gray-400">
                        Sin contacto
                      </div>
                    </td>
                    <td class="px-4 py-4">
                      <span
                        [class]="getCommitmentTypeClass(item.commitmentType)"
                        class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                      >
                        {{ getCommitmentTypeLabel(item.commitmentType) }}
                      </span>
                    </td>
                    <td class="px-4 py-4 text-right">
                      <span *ngIf="item.contributionAmount" class="font-semibold text-green-600">
                        \${{ item.contributionAmount | number : '1.2-2' }}
                      </span>
                      <span *ngIf="!item.contributionAmount" class="text-gray-400">-</span>
                    </td>
                    <td class="px-4 py-4 text-sm text-gray-600">
                      {{ formatDate(item.reservedAt) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminGiftsReportComponent implements OnInit {
  eventSlug = '';
  report: GiftReservationReport | null = null;
  loading = true;
  error: any = null;

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.eventSlug = this.route.snapshot.paramMap.get('eventId') || '';
    this.loadReport();
  }

  loadReport(): void {
    this.loading = true;
    this.error = null;

    this.dashboardService.getGiftReservationsReport(this.eventSlug).subscribe({
      next: data => {
        this.report = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = {
          title: 'Error al cargar el reporte',
          message: 'No pudimos obtener el reporte de regalos reservados.',
          icon: '😔'
        };
      }
    });
  }

  countFullReservations(): number {
    return this.report?.items.filter(item => item.commitmentType === CommitmentType.FULL_RESERVATION).length || 0;
  }

  countContributions(): number {
    return this.report?.items.filter(item => item.commitmentType === CommitmentType.PARTIAL_CONTRIBUTION).length || 0;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      AVAILABLE: 'bg-gray-100 text-gray-800',
      RESERVED: 'bg-blue-100 text-blue-800',
      PARTIALLY_FUNDED: 'bg-yellow-100 text-yellow-800',
      FULLY_FUNDED: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      AVAILABLE: 'Disponible',
      RESERVED: 'Reservado',
      PARTIALLY_FUNDED: 'Financiado parcial',
      FULLY_FUNDED: 'Completado',
      INACTIVE: 'Inactivo'
    };
    return labels[status] || status;
  }

  getCommitmentTypeClass(type: string): string {
    return type === CommitmentType.FULL_RESERVATION ? 'bg-purple-100 text-purple-800' : 'bg-pink-100 text-pink-800';
  }

  getCommitmentTypeLabel(type: string): string {
    return type === CommitmentType.FULL_RESERVATION ? '🎁 Reserva completa' : '💝 Aporte parcial';
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
