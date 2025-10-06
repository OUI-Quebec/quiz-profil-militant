import { Component, input, output, viewChild } from '@angular/core';

import { Question } from '../../model/question';
import { Choix } from '../../model/choix';
import { LottieEmojiComponent } from '../lottie-emoji/lottie-emoji.component';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [LottieEmojiComponent],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss',
})
export class QuestionComponent {
  readonly question = input.required<Question>();
  readonly peutRetourner = input<boolean>(false);
  readonly choixEffectue = output<Choix>();
  readonly precedentDemande = output<void>();
  readonly passerDemande = output<void>();
  readonly recommencerDemande = output<void>();

  readonly precedentLottie =
    viewChild.required<LottieEmojiComponent>('precedentLottie');
  readonly suivantLottie =
    viewChild.required<LottieEmojiComponent>('suivantLottie');
  readonly passerLottie =
    viewChild.required<LottieEmojiComponent>('passerLottie');
  readonly recommencerLottie =
    viewChild.required<LottieEmojiComponent>('recommencerLottie');

  choixSelectionne: Choix | null = null;

  private isMobile(): boolean {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 768px)').matches
    );
  }

  emojiSize(): number {
    return this.isMobile() ? 20 : 28;
  }

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

  onHoverPrecedent(isHovering: boolean): void {
    const precedentLottie = this.precedentLottie();
    if (precedentLottie) {
      if (isHovering) {
        precedentLottie.playAnimation();
      } else {
        precedentLottie.stopAnimation();
      }
    }
  }

  onHoverSuivant(isHovering: boolean): void {
    const suivantLottie = this.suivantLottie();
    if (suivantLottie) {
      if (isHovering) {
        suivantLottie.playAnimation();
      } else {
        suivantLottie.stopAnimation();
      }
    }
  }

  onHoverPasser(isHovering: boolean): void {
    const passerLottie = this.passerLottie();
    if (passerLottie) {
      if (isHovering) {
        passerLottie.playAnimation();
      } else {
        passerLottie.stopAnimation();
      }
    }
  }

  onHoverRecommencer(isHovering: boolean): void {
    const recommencerLottie = this.recommencerLottie();
    if (recommencerLottie) {
      if (isHovering) {
        recommencerLottie.playAnimation();
      } else {
        recommencerLottie.stopAnimation();
      }
    }
  }
}
