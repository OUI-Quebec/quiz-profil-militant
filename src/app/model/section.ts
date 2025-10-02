import { Question } from './question';

export interface Section {
  section: string;
  questions: Question[];
}
