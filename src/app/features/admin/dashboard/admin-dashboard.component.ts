import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DashboardService } from '@core/services';
import { Dashboard } from '@core/models';
import { LoadingSpinnerComponent, ErrorMessageComponent } from '@shared/components';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, ErrorMessageComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-6">
          <h1 class="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p *ngIf="dashboard" class="text-gray-600">
            {{ dashboard.event.babyName }} - {{ formatDate(dashboard.event.eventDate) }}
          </p>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 py-8">
        <app-loading-spinner *ngIf="loading" />

        <app-error-message *ngIf="error" [error]="error" (retry)="loadDashboard()" />

        <div *ngIf="!loading && !error && dashboard" class="space-y-6">
          <!-- Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- RSVPs -->
            <div class="card">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-sm font-semibold text-gray-600">Confirmaciones</h3>
                <span class="text-2xl">✅</span>
              </div>
              <p class="text-3xl font-bold text-gray-900">{{ dashboard.rsvpSummary.confirmed }}</p>
              <p class="text-sm text-gray-500">de {{ dashboard.rsvpSummary.totalResponses }} respuestas</p>
            </div>

            <!-- Guests -->
            <div class="card">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-sm font-semibold text-gray-600">Invitados esperados</h3>
                <span class="text-2xl">👥</span>
              </div>
              <p class="text-3xl font-bold text-gray-900">{{ dashboard.rsvpSummary.totalExpectedGuests }}</p>
              <p class="text-sm text-gray-500">personas confirmadas</p>
            </div>

            <!-- Gifts Progress -->
            <div class="card">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-sm font-semibold text-gray-600">Regalos</h3>
                <span class="text-2xl">🎁</span>
              </div>
              <p class="text-3xl font-bold text-gray-900">{{ dashboard.giftSummary.coveragePercentage }}%</p>
              <p class="text-sm text-gray-500">
                {{ dashboard.giftSummary.fullyFundedGifts }} de {{ dashboard.giftSummary.totalGifts }} completados
              </p>
            </div>

            <!-- Messages -->
            <div class="card">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-sm font-semibold text-gray-600">Mensajes para el bebé</h3>
                <span class="text-2xl">💌</span>
              </div>
              <p class="text-3xl font-bold text-gray-900">{{ dashboard.statistics.totalBabyMessages }}</p>
              <p class="text-sm text-gray-500">mensajes recibidos</p>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div class="bg-white rounded-2xl shadow-card overflow-hidden">
            <nav class="flex border-b border-gray-200">
              <a
                [routerLink]="['/admin', eventSlug, 'gifts']"
                routerLinkActive="border-primary-500 text-primary-600"
                class="px-6 py-4 font-medium border-b-2 border-transparent hover:border-gray-300 transition-colors"
              >
                🎁 Regalos
              </a>
              <a
                [routerLink]="['/admin', eventSlug, 'attendees']"
                routerLinkActive="border-primary-500 text-primary-600"
                class="px-6 py-4 font-medium border-b-2 border-transparent hover:border-gray-300 transition-colors"
              >
                👥 Asistentes
              </a>
              <a
                [routerLink]="['/admin', eventSlug, 'ideas']"
                routerLinkActive="border-primary-500 text-primary-600"
                class="px-6 py-4 font-medium border-b-2 border-transparent hover:border-gray-300 transition-colors"
              >
                💡 Ideas
              </a>
              <a
                [routerLink]="['/admin', eventSlug, 'baby-messages']"
                routerLinkActive="border-primary-500 text-primary-600"
                class="px-6 py-4 font-medium border-b-2 border-transparent hover:border-gray-300 transition-colors"
              >
                💌 Mensajes
              </a>
            </nav>
          </div>

          <!-- Recent Activity -->
          <div class="card">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Actividad reciente</h3>
            <div class="space-y-3">
              <div
                *ngFor="let activity of dashboard.recentActivity"
                class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <span class="text-2xl">{{ getActivityIcon(activity.type) }}</span>
                <div class="flex-1">
                  <p class="text-gray-800">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500">{{ formatTimestamp(activity.timestamp) }}</p>
                </div>
              </div>

              <p *ngIf="dashboard.recentActivity.length === 0" class="text-center text-gray-500 py-4">
                No hay actividad reciente
              </p>
            </div>
          </div>

          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- RSVP Details -->
            <div class="card">
              <h3 class="text-lg font-bold text-gray-800 mb-4">Resumen de asistencias</h3>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">✅ Confirmados</span>
                  <span class="font-semibold">{{ dashboard.rsvpSummary.confirmed }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">❌ No asistirán</span>
                  <span class="font-semibold">{{ dashboard.rsvpSummary.declined }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">❓ Sin responder</span>
                  <span class="font-semibold">{{ dashboard.rsvpSummary.pending }}</span>
                </div>
              </div>
            </div>

            <!-- Gift Summary -->
            <div class="card">
              <h3 class="text-lg font-bold text-gray-800 mb-4">Resumen de regalos</h3>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Valor total</span>
                  <span class="font-semibold">\${{ dashboard.giftSummary.totalBudget }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Recaudado</span>
                  <span class="font-semibold text-green-600">\${{ dashboard.giftSummary.coveredBudget }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Pendiente</span>
                  <span class="font-semibold text-orange-600">\${{ dashboard.giftSummary.remainingBudget }}</span>
                </div>
                <div class="progress-bar mt-3">
                  <div class="progress-fill" [style.width.%]="dashboard.giftSummary.coveragePercentage"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  eventSlug: string = '';
  dashboard: Dashboard | null = null;
  loading = true;
  error: any = null;

  constructor(private route: ActivatedRoute, private router: Router, private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.eventSlug = this.route.snapshot.paramMap.get('slug') || '';
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.error = null;

    this.dashboardService.getDashboard(this.eventSlug).subscribe({
      next: data => {
        this.dashboard = data;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.error = {
          title: 'Error al cargar el dashboard',
          message: 'No pudimos obtener la información del evento.',
          icon: '😔'
        };
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffMins < 1440) return `Hace ${Math.floor(diffMins / 60)} horas`;
    return date.toLocaleDateString('es-ES');
  }

  getActivityIcon(type: string): string {
    const icons: Record<string, string> = {
      RSVP_CONFIRMED: '✅',
      RSVP_DECLINED: '💙',
      GIFT_RESERVED: '🎁',
      GIFT_CONTRIBUTED: '💝',
      IDEA_SUBMITTED: '💡',
      BABY_MESSAGE_RECEIVED: '💌'
    };
    return icons[type] || '📌';
  }
}
