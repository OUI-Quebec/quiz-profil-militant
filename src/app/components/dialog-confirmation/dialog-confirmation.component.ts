import { Component, input, output } from '@angular/core';


@Component({
  selector: 'app-dialog-confirmation',
  standalone: true,
  imports: [],
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
