export interface ProgressionQuiz {
  sectionActuelle: number;
  questionActuelle: number;
  reponses: { [key: string]: string };
  complete: boolean;
  dateDebut: Date;
}
