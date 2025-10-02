import { Component, Input, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profil } from '../../model/profil';
import { QuizService } from '../../services/quiz.service';
import { ProfilDialogComponent } from '../profil-dialog/profil-dialog.component';

@Component({
  selector: 'app-resultats',
  standalone: true,
  imports: [CommonModule, ProfilDialogComponent],
  templateUrl: './resultats.component.html',
  styleUrl: './resultats.component.scss',
})
export class ResultatsComponent implements OnInit {
  @Input() profils: Profil[] = [];

  profilPrincipal: Profil | null = null;
  autresProfils: Profil[] = [];

  // Signaux pour le dialogue
  private dialogOpen = signal(false);
  private profilSelectionne = signal<Profil | null>(null);

  // Computed pour les données du dialogue
  isDialogOpen = computed(() => this.dialogOpen());
  profil = computed(() => this.profilSelectionne());

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    if (this.profils && this.profils.length > 0) {
      this.profilPrincipal = this.profils[0];
      this.autresProfils = this.profils.slice(1).filter((p) => p.score > 0);
    }
  }

  getEmojiPourProfil(nom: string): string {
    const emojis: { [key: string]: string } = {
      Activiste: '⚡',
      Idées: '🧠',
      Leader: '👥',
    };
    return emojis[nom] || '🎯';
  }

  getConseilsPourProfil(nom: string): string[] {
    const conseils: { [key: string]: string[] } = {
      Activiste: [
        'Participe aux manifestations et actions de rue',
        'Distribue des tracts dans les lieux publics',
        'Organise des actions de visibilité créatives',
      ],
      Idées: [
        "Rédige des textes d'opinion pour les médias",
        'Anime des ateliers de formation politique',
        'Participe aux débats et discussions publiques',
      ],
      Leader: [
        'Coordonne des équipes locales',
        'Planifie les campagnes et stratégies',
        'Anime des assemblées et réunions',
      ],
    };
    return conseils[nom] || ['Engage-toi selon tes forces !'];
  }

  partagerResultats(): void {
    if (this.profilPrincipal && navigator.share) {
      navigator.share({
        title: 'Mon profil militant OUI Québec',
        text: `Je suis ${this.profilPrincipal.nom} ! Découvre ton profil militant pour l'indépendance du Québec.`,
        url: window.location.origin,
      });
    } else {
      // Fallback pour les navigateurs sans Web Share API
      const text = `Je suis ${this.profilPrincipal?.nom} ! Découvre ton profil militant : ${window.location.origin}`;
      navigator.clipboard.writeText(text);
      alert('Lien copié dans le presse-papiers !');
    }
  }

  ouvrirDialogProfil(profil: Profil): void {
    this.profilSelectionne.set(profil);
    this.dialogOpen.set(true);
  }

  fermerDialog(): void {
    this.dialogOpen.set(false);
    this.profilSelectionne.set(null);
  }

  recommencerQuiz(): void {
    if (
      confirm(
        'Es-tu sûr·e de vouloir recommencer le quiz ? Toute ta progression sera perdue.'
      )
    ) {
      // D'abord nettoyer les données via le service
      this.quizService.recommencerQuiz();

      // Puis recharger la page pour revenir à l'accueil
      window.location.href = '/';
    }
  }
}
