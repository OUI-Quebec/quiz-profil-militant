import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Section } from '../model/section';
import { ProgressionQuiz } from '../model/progression-quiz';
import { Profil } from '../model/profil';
import { ProfilService } from './profil.service';
import * as yaml from 'js-yaml';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private profilService = inject(ProfilService);

  // Signaux pour l'état de l'application
  private _sections = signal<Section[]>([]);
  private _progression = signal<ProgressionQuiz>({
    sectionActuelle: 0,
    questionActuelle: 0,
    reponses: {},
    complete: false,
    dateDebut: new Date(),
  });

  // Signaux publics (readonly)
  sections = this._sections.asReadonly();
  progression = this._progression.asReadonly();

  // Signaux computed pour les statistiques
  statistiques = computed(() => {
    const sections = this._sections();
    const progression = this._progression();
    const totalQuestions = sections.reduce(
      (total, section) => total + section.questions.length,
      0
    );
    const questionsRepondues = Object.keys(progression.reponses).length;
    const progressionPourcentage =
      totalQuestions > 0 ? (questionsRepondues / totalQuestions) * 100 : 0;
    const sectionActuelle =
      sections[progression.sectionActuelle]?.section || '';
    const questionsRestantes = totalQuestions - questionsRepondues;

    return {
      totalQuestions,
      questionsRepondues,
      progressionPourcentage,
      sectionActuelle,
      questionsRestantes,
    };
  });

  // Signal computed pour les profils
  profils = computed(() => {
    const progression = this._progression();
    if (!progression.complete) return [];

    const profilsDisponibles = this.profilService.getTousProfils();
    if (profilsDisponibles.length === 0) return [];

    const scores: { [key: string]: number } = {
      Activiste: 0,
      Idées: 0,
      Leader: 0,
    };

    // Compter les réponses par type
    Object.values(progression.reponses).forEach((type) => {
      if (scores[type] !== undefined) {
        scores[type]++;
      }
    });

    // Créer les profils avec scores en utilisant les données du YAML
    const profilsAvecScores: Profil[] = profilsDisponibles.map((profil) => ({
      ...profil,
      score: scores[profil.nom] || 0,
    }));

    // Trier par score décroissant
    return profilsAvecScores.sort((a, b) => b.score - a.score);
  });

  private readonly STORAGE_KEY = 'quiz-progression-oui-quebec';

  constructor() {
    this.chargerQuiz();
    this.chargerProgression();

    // Effect pour sauvegarder automatiquement la progression
    effect(() => {
      const progression = this._progression();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progression));
    });
  }

  /**
   * Mélange aléatoirement un tableau en utilisant l'algorithme Fisher-Yates
   */
  private melangerTableau<T>(array: T[]): T[] {
    const melange = [...array]; // Copie pour éviter de modifier l'original
    for (let i = melange.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [melange[i], melange[j]] = [melange[j], melange[i]];
    }
    return melange;
  }

  /**
   * Charge les données du quiz depuis le fichier YAML
   */
  private async chargerQuiz(): Promise<void> {
    try {
      const response = await fetch('./quiz.yaml');
      const yamlText = await response.text();
      const sections = yaml.load(yamlText) as Section[];

      // Mélanger les choix pour chaque question
      const sectionsAvecChoixMelanges = sections.map((section) => ({
        ...section,
        questions: section.questions.map((question) => ({
          ...question,
          choix: this.melangerTableau(question.choix),
        })),
      }));

      this._sections.set(sectionsAvecChoixMelanges);
    } catch (error) {
      console.error('Erreur lors du chargement du quiz:', error);
    }
  }

  /**
   * Charge la progression sauvegardée depuis le localStorage
   */
  private chargerProgression(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const progression = JSON.parse(saved);
        progression.dateDebut = new Date(progression.dateDebut);
        this._progression.set(progression);
      } catch (error) {
        console.error('Erreur lors du chargement de la progression:', error);
      }
    }
  }

  /**
   * Enregistre une réponse pour la question actuelle
   */
  enregistrerReponse(typeReponse: string): void {
    const progression = this._progression();
    const sections = this._sections();

    if (sections.length > 0) {
      const cleQuestion = `${progression.sectionActuelle}-${progression.questionActuelle}`;

      this._progression.update((current) => ({
        ...current,
        reponses: {
          ...current.reponses,
          [cleQuestion]: typeReponse,
        },
      }));
    }
  }

  /**
   * Passe à la question suivante
   */
  questionSuivante(): void {
    const progression = this._progression();
    const sections = this._sections();

    if (sections.length > 0) {
      const sectionActuelle = sections[progression.sectionActuelle];

      this._progression.update((current) => {
        if (current.questionActuelle < sectionActuelle.questions.length - 1) {
          // Question suivante dans la même section
          return {
            ...current,
            questionActuelle: current.questionActuelle + 1,
          };
        } else if (current.sectionActuelle < sections.length - 1) {
          // Section suivante
          return {
            ...current,
            sectionActuelle: current.sectionActuelle + 1,
            questionActuelle: 0,
          };
        } else {
          // Quiz terminé
          return {
            ...current,
            complete: true,
          };
        }
      });
    }
  }

  /**
   * Revient à la question précédente
   */
  questionPrecedente(): void {
    const progression = this._progression();

    this._progression.update((current) => {
      if (current.questionActuelle > 0) {
        return {
          ...current,
          questionActuelle: current.questionActuelle - 1,
        };
      } else if (current.sectionActuelle > 0) {
        const sections = this._sections();
        return {
          ...current,
          sectionActuelle: current.sectionActuelle - 1,
          questionActuelle:
            sections[current.sectionActuelle - 1].questions.length - 1,
        };
      }
      return current;
    });
  }

  /**
   * Passe la question actuelle sans répondre
   */
  passerQuestion(): void {
    this.questionSuivante();
  }

  /**
   * Recommence le quiz depuis le début
   */
  recommencerQuiz(): void {
    // Vider complètement le localStorage
    localStorage.clear();

    // Réinitialiser la progression
    const nouvelleProgression: ProgressionQuiz = {
      sectionActuelle: 0,
      questionActuelle: 0,
      reponses: {},
      complete: false,
      dateDebut: new Date(),
    };

    this._progression.set(nouvelleProgression);
  }
}
