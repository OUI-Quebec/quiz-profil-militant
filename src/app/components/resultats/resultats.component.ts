import { Component, Input, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profil } from '../../model/profil';
import { QuizService } from '../../services/quiz.service';
import { ProfilService } from '../../services/profil.service';
import { ProfilDialogComponent } from '../profil-dialog/profil-dialog.component';
import { LottieEmojiComponent } from '../lottie-emoji/lottie-emoji.component';

@Component({
  selector: 'app-resultats',
  standalone: true,
  imports: [CommonModule, ProfilDialogComponent, LottieEmojiComponent],
  templateUrl: './resultats.component.html',
  styleUrl: './resultats.component.scss',
})
export class ResultatsComponent implements OnInit {
  @Input() profils: Profil[] = [];

  profilPrincipal: Profil | null = null;
  autresProfils: Profil[] = [];

  private dialogOpen = signal(false);
  private profilSelectionne = signal<Profil | null>(null);

  isDialogOpen = computed(() => this.dialogOpen());
  profil = computed(() => this.profilSelectionne());

  constructor(
    private quizService: QuizService,
    private profilService: ProfilService
  ) {}

  ngOnInit(): void {
    if (this.profils && this.profils.length > 0) {
      this.profilPrincipal = this.profils[0];
      this.autresProfils = this.profils.slice(1).filter((p) => p.score > 0);
    }
  }

  getEmojiCodePourProfil(nom: string): string {
    const profilData = this.profilService.getProfilParNom(nom);
    return profilData?.emojis || '1f3af';
  }

  getConseilsPourProfil(nom: string): string[] {
    const profilData = this.profilService.getProfilParNom(nom);
    return profilData?.exemples_action || ['Engage-toi selon tes forces !'];
  }

  getDescriptionCourtePourProfil(nom: string): string {
    const profilData = this.profilService.getProfilParNom(nom);
    return profilData?.description_courte || '';
  }

  getDescriptionLonguePourProfil(nom: string): string {
    const profilData = this.profilService.getProfilParNom(nom);
    return profilData?.description_longue || '';
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
