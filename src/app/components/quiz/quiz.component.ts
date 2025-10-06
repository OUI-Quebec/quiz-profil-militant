import { Component, computed, signal, inject } from '@angular/core';

import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { ProgressionHeaderComponent } from '../progression-header/progression-header.component';
import { SectionPresentationComponent } from '../section-presentation/section-presentation.component';
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
    SectionPresentationComponent,
    QuestionComponent,
    ResultatsComponent,
    FooterComponent,
    DialogConfirmationComponent
],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
})
export class QuizComponent {
  private quizService = inject(QuizService);
  private router = inject(Router);

  // Signaux locaux pour l'état de l'interface
  private sectionDejaCommencee = signal<number>(-1);
  showDialogRecommencer = signal<boolean>(false);

  // Signaux computed basés sur les données du service
  sections = computed(() => this.quizService.sections());
  progression = computed(() => this.quizService.progression());
  profils = computed(() => this.quizService.profils());
  statistiques = computed(() => this.quizService.statistiques());

  // Signaux computed pour l'affichage
  sectionActuelle = computed(() => {
    const sections = this.sections();
    const progression = this.progression();
    return sections[progression.sectionActuelle] || null;
  });

  questionActuelle = computed(() => {
    const section = this.sectionActuelle();
    const progression = this.progression();
    return section?.questions[progression.questionActuelle] || null;
  });

  peutRetourner = computed(() => {
    const progression = this.progression();
    return progression.sectionActuelle > 0 || progression.questionActuelle > 0;
  });

  doitMontrerPresentationSection = computed(() => {
    const progression = this.progression();
    if (!progression) return false;

    const sectionActuelle = progression.sectionActuelle;

    // Si on a déjà commencé cette section, ne plus montrer la présentation
    if (this.sectionDejaCommencee() === sectionActuelle) return false;

    // Vérifier si on doit montrer la présentation de section
    const indexSection = progression.sectionActuelle;
    const indexQuestion = progression.questionActuelle;

    const aDejaReponduCetteSection = Object.keys(progression.reponses).some(
      (cle) => cle.startsWith(`${indexSection}-`)
    );

    return !aDejaReponduCetteSection && indexQuestion === 0;
  });

  /**
   * Commence la section actuelle (cache la présentation)
   */
  commencerSection(): void {
    const sectionActuelle = this.progression().sectionActuelle;
    this.sectionDejaCommencee.set(sectionActuelle);
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
    this.sectionDejaCommencee.set(-1); // Réinitialiser l'état local

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
