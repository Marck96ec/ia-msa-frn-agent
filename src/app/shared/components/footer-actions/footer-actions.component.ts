import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FooterAction {
  label: string;
  action: string;
  icon?: string;
  primary?: boolean;
}

@Component({
  selector: 'app-footer-actions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 p-4 safe-area-bottom">
      <div class="max-w-2xl mx-auto">
        <div *ngIf="actions.length === 1" class="w-full">
          <button 
            (click)="onAction(actions[0])"
            [class]="actions[0].primary !== false ? 'btn-primary w-full' : 'btn-secondary w-full'">
            <span *ngIf="actions[0].icon" class="mr-2">{{ actions[0].icon }}</span>
            {{ actions[0].label }}
          </button>
        </div>
        <div *ngIf="actions.length > 1" class="grid gap-3" 
             [class.grid-cols-2]="actions.length === 2"
             [class.grid-cols-1]="actions.length > 2">
          <button 
            *ngFor="let action of actions"
            (click)="onAction(action)"
            [class]="action.primary ? 'btn-primary' : 'btn-secondary'">
            <span *ngIf="action.icon" class="mr-2">{{ action.icon }}</span>
            {{ action.label }}
          </button>
        </div>
      </div>
    </footer>
    <!-- Spacer para evitar que el contenido quede debajo del footer -->
    <div class="h-24"></div>
  `
})
export class FooterActionsComponent {
  @Input() actions: FooterAction[] = [];
  @Output() actionClicked = new EventEmitter<FooterAction>();

  onAction(action: FooterAction): void {
    this.actionClicked.emit(action);
  }
}
