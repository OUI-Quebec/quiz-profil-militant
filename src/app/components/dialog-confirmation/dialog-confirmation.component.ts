import { Component, input, output } from '@angular/core';
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

  readonly confirmer = output<void>();
  readonly annuler = output<void>();

  onConfirmer(): void {
    // TODO: The 'emit' function requires a mandatory void argument
    this.confirmer.emit();
  }

  onAnnuler(): void {
    // TODO: The 'emit' function requires a mandatory void argument
    this.annuler.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onAnnuler();
    }
  }
}
