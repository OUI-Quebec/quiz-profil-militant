import {
  Component,
  ViewChild,
  input,
  output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../model/question';
import { Choix } from '../../model/choix';
import { LottieEmojiComponent } from '../lottie-emoji/lottie-emoji.component';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, LottieEmojiComponent],
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

  @ViewChild('precedentLottie') precedentLottie!: LottieEmojiComponent;
  @ViewChild('suivantLottie') suivantLottie!: LottieEmojiComponent;
  @ViewChild('passerLottie') passerLottie!: LottieEmojiComponent;
  @ViewChild('recommencerLottie') recommencerLottie!: LottieEmojiComponent;

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
    // TODO: The 'emit' function requires a mandatory void argument
    this.precedentDemande.emit();
  }

  passer(): void {
    // TODO: The 'emit' function requires a mandatory void argument
    this.passerDemande.emit();
  }

  recommencer(): void {
    // TODO: The 'emit' function requires a mandatory void argument
    this.recommencerDemande.emit();
  }

  onHoverPrecedent(isHovering: boolean): void {
    if (this.precedentLottie) {
      if (isHovering) {
        this.precedentLottie.playAnimation();
      } else {
        this.precedentLottie.stopAnimation();
      }
    }
  }

  onHoverSuivant(isHovering: boolean): void {
    if (this.suivantLottie) {
      if (isHovering) {
        this.suivantLottie.playAnimation();
      } else {
        this.suivantLottie.stopAnimation();
      }
    }
  }

  onHoverPasser(isHovering: boolean): void {
    if (this.passerLottie) {
      if (isHovering) {
        this.passerLottie.playAnimation();
      } else {
        this.passerLottie.stopAnimation();
      }
    }
  }

  onHoverRecommencer(isHovering: boolean): void {
    if (this.recommencerLottie) {
      if (isHovering) {
        this.recommencerLottie.playAnimation();
      } else {
        this.recommencerLottie.stopAnimation();
      }
    }
  }
}
