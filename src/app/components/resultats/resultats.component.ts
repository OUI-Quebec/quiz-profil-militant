import {
  Component,
  OnInit,
  signal,
  computed,
  input,
  viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Profil } from '../../model/profil';
import { QuizService } from '../../services/quiz.service';
import { ProfilService } from '../../services/profil.service';
import { ProfilDialogComponent } from '../profil-dialog/profil-dialog.component';
import { LottieEmojiComponent } from '../lottie-emoji/lottie-emoji.component';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';

@Component({
  selector: 'app-resultats',
  standalone: true,
  imports: [
    CommonModule,
    ProfilDialogComponent,
    LottieEmojiComponent,
    DialogConfirmationComponent,
  ],
  templateUrl: './resultats.component.html',
  styleUrl: './resultats.component.scss',
})
export class ResultatsComponent implements OnInit {
  readonly profils = input<Profil[]>([]);
  readonly implicationLottie = viewChild.required<LottieEmojiComponent>('implicationLottie');
  readonly refaireLottie = viewChild.required<LottieEmojiComponent>('refaireLottie');

  profilPrincipal: Profil | null = null;
  autresProfils: Profil[] = [];

  private dialogOpen = signal(false);
  private profilSelectionne = signal<Profil | null>(null);
  showDialogRecommencer = signal<boolean>(false);

  isDialogOpen = computed(() => this.dialogOpen());
  profil = computed(() => this.profilSelectionne());

  constructor(
    private quizService: QuizService,
    private profilService: ProfilService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const profils = this.profils();
    if (profils && profils.length > 0) {
      this.profilPrincipal = profils[0];
      this.autresProfils = profils.slice(1).filter((p) => p.score > 0);
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

  getCouleurPourProfil(nom: string): string {
    const profilData = this.profilService.getProfilParNom(nom);
    return profilData?.couleur || '#3b82f6';
  }

  partagerSurX(): void {
    if (this.profilPrincipal) {
      const url = encodeURIComponent(window.location.origin);
      const text = encodeURIComponent(
        `Je suis ${this.profilPrincipal.nom} ! Découvre ton profil militant pour l'indépendance du Québec. ${window.location.origin}`
      );
      const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;
      window.open(twitterUrl, '_blank', 'width=600,height=400');
    }
  }

  onHoverImplication(isHovering: boolean): void {
    const implicationLottie = this.implicationLottie();
    if (implicationLottie) {
      if (isHovering) {
        implicationLottie.playAnimation();
      } else {
        implicationLottie.stopAnimation();
      }
    }
  }

  onHoverRefaire(isHovering: boolean): void {
    const refaireLottie = this.refaireLottie();
    if (refaireLottie) {
      if (isHovering) {
        refaireLottie.playAnimation();
      } else {
        refaireLottie.stopAnimation();
      }
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
    this.showDialogRecommencer.set(true);
  }

  /**
   * Confirme le redémarrage du quiz
   */
  confirmerRecommencer(): void {
    this.showDialogRecommencer.set(false);
    // D'abord nettoyer les données via le service
    this.quizService.recommencerQuiz();

    // Puis naviguer vers l'accueil avec le router Angular
    this.router.navigate(['/']);
  }

  /**
   * Annule le redémarrage du quiz
   */
  annulerRecommencer(): void {
    this.showDialogRecommencer.set(false);
  }
}
