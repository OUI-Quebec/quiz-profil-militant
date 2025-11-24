import { Component, computed, signal, inject, DestroyRef } from '@angular/core';

import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { ProgressionHeaderComponent } from '../progression-header/progression-header.component';
import { QuestionComponent } from '../question/question.component';
import { ResultatsComponent } from '../resultats/resultats.component';
import { FooterComponent } from '../footer/footer.component';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { Choix } from '../../model/choix';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    ProgressionHeaderComponent,
    QuestionComponent,
    ResultatsComponent,
    FooterComponent,
    DialogConfirmationComponent,
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
})
export class QuizComponent {
  private quizService = inject(QuizService);
  private router = inject(Router);

  // Signaux locaux pour l'état de l'interface
  showDialogRecommencer = signal<boolean>(false);

  // Signaux computed basés sur les données du service
  questions = computed(() => this.quizService.questions());
  progression = computed(() => this.quizService.progression());
  profils = computed(() => this.quizService.profils());
  statistiques = computed(() => this.quizService.statistiques());

  // Signaux computed pour l'affichage
  questionActuelle = computed(() => {
    const questions = this.questions();
    const progression = this.progression();
    return questions[progression.questionActuelle] || null;
  });

  peutRetourner = computed(() => {
    const progression = this.progression();
    return progression.questionActuelle > 0;
  });

  // Ajuste dynamiquement la variable CSS --hauteur-header pour que
  // la présentation de section puisse utiliser calc(100vh - var(--hauteur-header))
  constructor() {
    const destroyRef = inject(DestroyRef);
    let headerObserver: ResizeObserver | null = null;

    const maj = () => this.mettreAJourHauteurHeader();

    // Différer après premier rendu macro + rAF pour stabilité (fonts, layout)
    setTimeout(() => {
      requestAnimationFrame(() => {
        const headerEl = document.querySelector('.progression-header');
        if (headerEl) {
          if (!headerObserver) {
            headerObserver = new ResizeObserver(() => maj());
            headerObserver.observe(headerEl);
          }
          maj();
        }
      });
    }, 0);

    // Listeners supplémentaires (sécurise orientation / UI mobile)
    const resizeHandler = () => maj();
    window.addEventListener('resize', resizeHandler);
    window.addEventListener('orientationchange', resizeHandler);

    destroyRef.onDestroy(() => {
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('orientationchange', resizeHandler);
      if (headerObserver) headerObserver.disconnect();
    });
  }

  private mettreAJourHauteurHeader(): void {
    const headerEl = document.querySelector(
      '.progression-header'
    ) as HTMLElement | null;
    const root = document.documentElement;
    if (!root) return;
    const h = headerEl?.offsetHeight;
    if (h && h > 0) {
      root.style.setProperty('--hauteur-header', h + 'px');
    }
    // Met aussi une variable utilisant dvh (Chrome mobile moderne) si supporté
    if (window?.visualViewport) {
      const dvh = window.visualViewport.height;
      if (dvh) root.style.setProperty('--viewport-hauteur', dvh + 'px');
    }
  }


  /**
   * Traite la réponse à une question
   */
  repondreQuestion(choix: Choix): void {
    this.quizService.enregistrerReponse(choix.type);
    this.quizService.questionSuivante();
  }

  /**
   * Revient à la question précédente
   */
  questionPrecedente(): void {
    this.quizService.questionPrecedente();
  }

  /**
   * Passe la question actuelle
   */
  passerQuestion(): void {
    this.quizService.passerQuestion();
  }

  /**
   * Recommence le quiz depuis le début
   */
  recommencerQuiz(): void {
    this.showDialogRecommencer.set(true);
  }

  /**
   * Confirme le redémarrage du quiz
   */
  confirmerRecommencer(): void {
    this.showDialogRecommencer.set(false);
    this.quizService.recommencerQuiz();

    // Naviguer vers l'accueil avec le router Angular
    this.router.navigate(['/']);
  }

  /**
   * Annule le redémarrage du quiz
   */
  annulerRecommencer(): void {
    this.showDialogRecommencer.set(false);
  }
}
