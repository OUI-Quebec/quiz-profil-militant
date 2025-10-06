import { Routes } from '@angular/router';



export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/accueil/accueil.component').then(m => m.AccueilComponent) },
  { path: 'quiz', loadComponent: () => import('./components/quiz/quiz.component').then(m => m.QuizComponent) },
  { path: '**', redirectTo: '' },
];
