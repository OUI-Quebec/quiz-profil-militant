import {
  Component,
  Input,
  OnInit,
  signal,
  computed,
  ViewChild,
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
  @Input() profils: Profil[] = [];
  @ViewChild('implicationLottie') implicationLottie!: LottieEmojiComponent;
  @ViewChild('refaireLottie') refaireLottie!: LottieEmojiComponent;

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
    if (this.implicationLottie) {
      if (isHovering) {
        this.implicationLottie.playAnimation();
      } else {
        this.implicationLottie.stopAnimation();
      }
    }
  }

  onHoverRefaire(isHovering: boolean): void {
    if (this.refaireLottie) {
      if (isHovering) {
        this.refaireLottie.playAnimation();
      } else {
        this.refaireLottie.stopAnimation();
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
