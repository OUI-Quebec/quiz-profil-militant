import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-infolettre-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './infolettre-modal.component.html',
  styleUrl: './infolettre-modal.component.scss',
})
export class InfolettreModalComponent {
  @Input({ required: true }) isOpen = false;
  @Output() close = new EventEmitter<void>();

  fermer(): void {
    this.close.emit();
  }
}
