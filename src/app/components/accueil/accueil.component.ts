import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfilService } from '../../services/profil.service';
import { ProfilDialogComponent } from '../profil-dialog/profil-dialog.component';
import { LottieEmojiComponent } from '../lottie-emoji/lottie-emoji.component';
import { Profil } from '../../model/profil';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, ProfilDialogComponent, LottieEmojiComponent],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss',
})
export class AccueilComponent {
  // Signal pour le dialogue
  private dialogOpen = signal(false);
  private profilSelectionne = signal<Profil | null>(null);

  // Computed pour les données du dialogue
  isDialogOpen = computed(() => this.dialogOpen());
  profil = computed(() => this.profilSelectionne());

  constructor(private router: Router, private profilService: ProfilService) {}

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
}
