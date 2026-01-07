import { Component, computed, signal, viewChild, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ProfilService } from '../../services/profil.service';
import { ProfilDialogComponent } from '../profil-dialog/profil-dialog.component';
import { LottieEmojiComponent } from '../lottie-emoji/lottie-emoji.component';
import { FooterComponent } from '../footer/footer.component';
import { InfolettreModalComponent } from '../infolettre-modal/infolettre-modal.component';
import { Profil } from '../../model/profil';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [ProfilDialogComponent, LottieEmojiComponent, FooterComponent, InfolettreModalComponent],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss',
})
export class AccueilComponent {
  private router = inject(Router);
  private profilService = inject(ProfilService);

  readonly commencerLottie =
    viewChild.required<LottieEmojiComponent>('commencerLottie');

  // Signal pour le dialogue
  private dialogOpen = signal(false);
  private profilSelectionne = signal<Profil | null>(null);
  private infolettreOpen = signal(false);

  // Computed pour les données du dialogue
  isDialogOpen = computed(() => this.dialogOpen());
  profil = computed(() => this.profilSelectionne());
  infolettreVisible = computed(() => this.infolettreOpen());

  // Computed pour récupérer les profils avec leurs données complètes
  profils = computed(() => {
    const profilsYaml = this.profilService.getTousProfils();
    if (profilsYaml.length === 0) return [];

    return profilsYaml
      .map((profilData) => {
        return {
          ...profilData,
          icon: profilData.emojis || '🎯', // Utiliser l'emoji du YAML ou icône par défaut
        };
      })
      .filter((p) => p.description_courte); // Filtrer ceux qui ont des données
  });

  commencerQuiz(): void {
    this.router.navigate(['/quiz']);
  }

  ouvrirDialogProfil(profil: any): void {
    this.profilSelectionne.set(profil);
    this.dialogOpen.set(true);
  }

  fermerDialog(): void {
    this.dialogOpen.set(false);
    this.profilSelectionne.set(null);
  }

  ouvrirPopupInfolettre(): void {
    this.infolettreOpen.set(true);
  }

  fermerPopupInfolettre(): void {
    this.infolettreOpen.set(false);
  }

  onHoverCommencer(isHovering: boolean): void {
    const commencerLottie = this.commencerLottie();
    if (commencerLottie) {
      if (isHovering) {
        commencerLottie.playAnimation();
      } else {
        commencerLottie.stopAnimation();
      }
    }
  }

  constructor() {
    // Ajuste une variable CSS fiable pour la hauteur visible (utile mobile iOS/Android)
    const majViewport = () => {
      if (typeof window === 'undefined') return;
      const vh = window.innerHeight;
      document.documentElement.style.setProperty(
        '--viewport-hauteur',
        vh + 'px'
      );
    };
    majViewport();
    window.addEventListener('resize', majViewport);
    window.addEventListener('orientationchange', majViewport);
  }
}
