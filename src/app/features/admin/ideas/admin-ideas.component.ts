import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IdeaService } from '@core/services';
import { Idea } from '@core/models';
import { LoadingSpinnerComponent, ErrorMessageComponent } from '@shared/components';

@Component({
  selector: 'app-admin-ideas',
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
              <h1 class="text-2xl font-bold text-gray-900">💡 Ideas de Colaboración</h1>
              <p class="text-gray-600">Propuestas de los invitados</p>
            </div>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 py-8">
        <app-loading-spinner *ngIf="loading" />

        <app-error-message *ngIf="error" [error]="error" (retry)="loadIdeas()" />

        <div *ngIf="!loading && !error" class="space-y-6">
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="card">
              <div class="flex items-center gap-3">
                <span class="text-3xl">💡</span>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ ideas.length }}</p>
                  <p class="text-sm text-gray-600">Ideas propuestas</p>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="flex items-center gap-3">
                <span class="text-3xl">✅</span>
                <div>
                  <p class="text-2xl font-bold text-green-600">{{ countApproved() }}</p>
                  <p class="text-sm text-gray-600">Aprobadas</p>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="flex items-center gap-3">
                <span class="text-3xl">⏳</span>
                <div>
                  <p class="text-2xl font-bold text-yellow-600">{{ countPending() }}</p>
                  <p class="text-sm text-gray-600">Pendientes</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Ideas List -->
          <div class="card">
            <div class="p-4 border-b border-gray-200">
              <h2 class="text-lg font-bold text-gray-800">Listado de ideas</h2>
            </div>

            <div *ngIf="ideas.length === 0" class="p-8 text-center">
              <p class="text-gray-500 text-lg">💭 Aún no hay ideas propuestas</p>
              <p class="text-gray-400 text-sm mt-2">Las ideas aparecerán aquí cuando los invitados las envíen</p>
            </div>

            <div *ngIf="ideas.length > 0" class="divide-y divide-gray-200">
              <div *ngFor="let idea of ideas" class="p-4 hover:bg-gray-50">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0">
                    <span
                      class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 text-lg"
                    >
                      💡
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-semibold text-gray-900">{{ idea.guestName || 'Invitado anónimo' }}</span>
                      <span
                        [class]="idea.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                      >
                        {{ idea.isApproved ? '✅ Aprobada' : '⏳ Pendiente' }}
                      </span>
                    </div>
                    <p class="text-gray-700">{{ idea.description }}</p>
                    <p *ngIf="idea.organizerComment" class="text-sm text-blue-600 mt-2 italic">
                      💬 {{ idea.organizerComment }}
                    </p>
                    <p class="text-xs text-gray-400 mt-2">{{ formatDate(idea.createdAt) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminIdeasComponent implements OnInit {
  eventSlug = '';
  ideas: Idea[] = [];
  loading = true;
  error: any = null;

  constructor(private route: ActivatedRoute, private ideaService: IdeaService) {}

  ngOnInit(): void {
    this.eventSlug = this.route.snapshot.paramMap.get('eventId') || '';
    this.loadIdeas();
  }

  loadIdeas(): void {
    this.loading = true;
    this.error = null;

    this.ideaService.getIdeas(this.eventSlug).subscribe({
      next: data => {
        this.ideas = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = {
          title: 'Error al cargar las ideas',
          message: 'No pudimos obtener las ideas propuestas.',
          icon: '😔'
        };
      }
    });
  }

  countApproved(): number {
    return this.ideas.filter(idea => idea.isApproved).length;
  }

  countPending(): number {
    return this.ideas.filter(idea => !idea.isApproved).length;
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
