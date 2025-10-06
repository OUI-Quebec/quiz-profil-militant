import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LottieEmojiComponent } from '../lottie-emoji/lottie-emoji.component';
import { Profil } from '../../model/profil';

@Component({
  selector: 'app-profil-dialog',
  standalone: true,
  imports: [CommonModule, LottieEmojiComponent],
  templateUrl: './profil-dialog.component.html',
  styleUrl: './profil-dialog.component.scss',
})
export class ProfilDialogComponent {
  readonly profil = input.required<Profil>();
  readonly isOpen = input(false);
  readonly close = output<void>();

  fermerDialog(): void {
    this.close.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.fermerDialog();
    }
  }
}
