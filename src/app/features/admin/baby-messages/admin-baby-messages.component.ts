import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BabyMessageService } from '@core/services';
import { BabyMessage } from '@core/models';
import { LoadingSpinnerComponent, ErrorMessageComponent } from '@shared/components';

@Component({
  selector: 'app-admin-baby-messages',
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
              <h1 class="text-2xl font-bold text-gray-900">💌 Mensajes para el Bebé</h1>
              <p class="text-gray-600">Mensajes de cariño de los invitados</p>
            </div>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 py-8">
        <app-loading-spinner *ngIf="loading" />

        <app-error-message *ngIf="error" [error]="error" (retry)="loadMessages()" />

        <div *ngIf="!loading && !error" class="space-y-6">
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="card">
              <div class="flex items-center gap-3">
                <span class="text-3xl">💌</span>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ messages.length }}</p>
                  <p class="text-sm text-gray-600">Mensajes recibidos</p>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="flex items-center gap-3">
                <span class="text-3xl">📢</span>
                <div>
                  <p class="text-2xl font-bold text-green-600">{{ countPublished() }}</p>
                  <p class="text-sm text-gray-600">Publicados</p>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="flex items-center gap-3">
                <span class="text-3xl">🎤</span>
                <div>
                  <p class="text-2xl font-bold text-purple-600">{{ countWithAudio() }}</p>
                  <p class="text-sm text-gray-600">Con audio</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Messages List -->
          <div class="card">
            <div class="p-4 border-b border-gray-200">
              <h2 class="text-lg font-bold text-gray-800">Mensajes de cariño</h2>
            </div>

            <div *ngIf="messages.length === 0" class="p-8 text-center">
              <p class="text-gray-500 text-lg">💭 Aún no hay mensajes para el bebé</p>
              <p class="text-gray-400 text-sm mt-2">Los mensajes aparecerán aquí cuando los invitados los envíen</p>
            </div>

            <div *ngIf="messages.length > 0" class="divide-y divide-gray-200">
              <div *ngFor="let message of messages" class="p-4 hover:bg-gray-50">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0">
                    <span
                      class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-100 text-pink-600 text-lg"
                    >
                      💕
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-semibold text-gray-900">{{ message.guestName || 'Invitado anónimo' }}</span>
                      <span
                        [class]="message.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                      >
                        {{ message.isPublished ? '📢 Publicado' : '🔒 No publicado' }}
                      </span>
                      <span
                        *ngIf="message.audioUrl"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                      >
                        🎤 Con audio
                      </span>
                    </div>
                    <p class="text-gray-700 whitespace-pre-line">{{ message.messageText }}</p>
                    <div *ngIf="message.audioUrl" class="mt-3">
                      <audio controls class="w-full max-w-md">
                        <source [src]="message.audioUrl" type="audio/mpeg" />
                        Tu navegador no soporta audio.
                      </audio>
                    </div>
                    <p class="text-xs text-gray-400 mt-2">{{ formatDate(message.createdAt) }}</p>
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
export class AdminBabyMessagesComponent implements OnInit {
  eventSlug = '';
  messages: BabyMessage[] = [];
  loading = true;
  error: any = null;

  constructor(private route: ActivatedRoute, private babyMessageService: BabyMessageService) {}

  ngOnInit(): void {
    this.eventSlug = this.route.snapshot.paramMap.get('eventId') || '';
    this.loadMessages();
  }

  loadMessages(): void {
    this.loading = true;
    this.error = null;

    this.babyMessageService.getBabyMessages(this.eventSlug, true).subscribe({
      next: data => {
        this.messages = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = {
          title: 'Error al cargar los mensajes',
          message: 'No pudimos obtener los mensajes para el bebé.',
          icon: '😔'
        };
      }
    });
  }

  countPublished(): number {
    return this.messages.filter(msg => msg.isPublished).length;
  }

  countWithAudio(): number {
    return this.messages.filter(msg => msg.audioUrl).length;
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
