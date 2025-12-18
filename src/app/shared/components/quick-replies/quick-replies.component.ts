import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickReply } from '@core/models';

@Component({
  selector: 'app-quick-replies',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-wrap gap-2 justify-center px-4" *ngIf="replies && replies.length > 0">
      <button
        *ngFor="let reply of replies"
        (click)="onSelect(reply)"
        class="chip hover:chip-active transition-all">
        {{ reply.label }}
      </button>
    </div>
  `
})
export class QuickRepliesComponent {
  @Input() replies: QuickReply[] = [];
  @Output() selected = new EventEmitter<QuickReply>();

  onSelect(reply: QuickReply): void {
    this.selected.emit(reply);
  }
}
