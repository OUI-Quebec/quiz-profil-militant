import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-progression-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progression-header.component.html',
  styleUrl: './progression-header.component.scss',
})
export class ProgressionHeaderComponent {
  private quizService = inject(QuizService);

  statistiques = computed(() => this.quizService.statistiques());
}
