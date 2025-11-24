export interface ProgressionQuiz {
  questionActuelle: number;
  reponses: { [key: string]: string };
  complete: boolean;
  dateDebut: Date;
}
