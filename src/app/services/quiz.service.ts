import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Question } from '../model/question';
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
  private _questions = signal<Question[]>([]);
  private _progression = signal<ProgressionQuiz>({
    questionActuelle: 0,
    reponses: {},
    complete: false,
    dateDebut: new Date(),
  });

  // Signaux publics (readonly)
  questions = this._questions.asReadonly();
  progression = this._progression.asReadonly();

  // Signaux computed pour les statistiques
  statistiques = computed(() => {
    const questions = this._questions();
    const progression = this._progression();
    const totalQuestions = questions.length;
    const questionsRepondues = Object.keys(progression.reponses).length;
    const progressionPourcentage =
      totalQuestions > 0 ? (questionsRepondues / totalQuestions) * 100 : 0;
    const questionsRestantes = totalQuestions - questionsRepondues;

    return {
      totalQuestions,
      questionsRepondues,
      progressionPourcentage,
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
      Introverti: 0,
      'Coordonateur-trice': 0,
      'Socio-culturel': 0,
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
      const questions = yaml.load(yamlText) as Question[];

      // Mélanger les choix pour chaque question
      const questionsAvecChoixMelanges = questions.map((question) => ({
        ...question,
        choix: this.melangerTableau(question.choix),
      }));

      this._questions.set(questionsAvecChoixMelanges);
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
    const questions = this._questions();

    if (questions.length > 0) {
      const cleQuestion = `${progression.questionActuelle}`;

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
    const questions = this._questions();

    if (questions.length > 0) {
      this._progression.update((current) => {
        if (current.questionActuelle < questions.length - 1) {
          // Question suivante
          return {
            ...current,
            questionActuelle: current.questionActuelle + 1,
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
    this._progression.update((current) => {
      if (current.questionActuelle > 0) {
        return {
          ...current,
          questionActuelle: current.questionActuelle - 1,
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
      questionActuelle: 0,
      reponses: {},
      complete: false,
      dateDebut: new Date(),
    };

    this._progression.set(nouvelleProgression);
  }
}
