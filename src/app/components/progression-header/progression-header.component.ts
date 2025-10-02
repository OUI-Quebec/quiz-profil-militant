import { Component, computed } from '@angular/core';
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
  statistiques = computed(() => this.quizService.statistiques());

  constructor(private quizService: QuizService) {}
}
