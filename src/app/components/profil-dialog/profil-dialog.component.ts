import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() profil: Profil | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  fermerDialog(): void {
    this.close.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.fermerDialog();
    }
  }
}
