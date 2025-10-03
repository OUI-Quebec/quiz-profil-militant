import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog-confirmation.component.html',
  styleUrl: './dialog-confirmation.component.scss',
})
export class DialogConfirmationComponent {
  @Input() isVisible: boolean = false;
  @Input() titre: string = 'Confirmation';
  @Input() message: string = 'Êtes-vous sûr de vouloir continuer ?';
  @Input() texteConfirmer: string = 'Confirmer';
  @Input() texteAnnuler: string = 'Annuler';

  @Output() confirmer = new EventEmitter<void>();
  @Output() annuler = new EventEmitter<void>();

  onConfirmer(): void {
    this.confirmer.emit();
  }

  onAnnuler(): void {
    this.annuler.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onAnnuler();
    }
  }
}
