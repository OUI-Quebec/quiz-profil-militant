import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../model/question';
import { Choix } from '../../model/choix';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss',
})
export class QuestionComponent {
  @Input() question: Question | null = null;
  @Input() peutRetourner: boolean = false;
  @Output() choixEffectue = new EventEmitter<Choix>();
  @Output() precedentDemande = new EventEmitter<void>();
  @Output() passerDemande = new EventEmitter<void>();
  @Output() recommencerDemande = new EventEmitter<void>();

  choixSelectionne: Choix | null = null;

  selectionnerChoix(choix: Choix): void {
    this.choixSelectionne = choix;
  }

  suivant(): void {
    if (this.choixSelectionne) {
      this.choixEffectue.emit(this.choixSelectionne);
      this.choixSelectionne = null;
    }
  }

  precedent(): void {
    this.precedentDemande.emit();
  }

  passer(): void {
    this.passerDemande.emit();
  }

  recommencer(): void {
    this.recommencerDemande.emit();
  }
}
