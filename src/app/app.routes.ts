import { Routes } from '@angular/router';
import { AccueilComponent } from './components/accueil/accueil.component';
import { QuizComponent } from './components/quiz/quiz.component';

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'quiz', component: QuizComponent },
  { path: '**', redirectTo: '' },
];
