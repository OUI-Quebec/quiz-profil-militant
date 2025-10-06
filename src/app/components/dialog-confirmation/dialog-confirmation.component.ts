import { Component, EventEmitter, Output, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog-confirmation.component.html',
  styleUrl: './dialog-confirmation.component.scss',
})
export class DialogConfirmationComponent {
  readonly isVisible = input<boolean>(false);
  readonly titre = input<string>('Confirmation');
  readonly message = input<string>('Êtes-vous sûr de vouloir continuer ?');
  readonly texteConfirmer = input<string>('Confirmer');
  readonly texteAnnuler = input<string>('Annuler');

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
