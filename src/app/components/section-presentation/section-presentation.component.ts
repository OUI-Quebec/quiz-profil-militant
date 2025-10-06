import { Component, input, output, viewChild } from '@angular/core';

import { Section } from '../../model/section';
import { LottieEmojiComponent } from '../lottie-emoji/lottie-emoji.component';

@Component({
  selector: 'app-section-presentation',
  standalone: true,
  imports: [LottieEmojiComponent],
  templateUrl: './section-presentation.component.html',
  styleUrl: './section-presentation.component.scss',
})
export class SectionPresentationComponent {
  readonly section = input.required<Section>();
  readonly numeroSection = input<number>(1);
  readonly commencer = output<void>();

  readonly commencerSectionLottie = viewChild.required<LottieEmojiComponent>(
    'commencerSectionLottie'
  );

  commencerSection(): void {
    this.commencer.emit();
  }

  onHoverCommencerSection(isHovering: boolean): void {
    const commencerSectionLottie = this.commencerSectionLottie();
    if (commencerSectionLottie) {
      if (isHovering) {
        commencerSectionLottie.playAnimation();
      } else {
        commencerSectionLottie.stopAnimation();
      }
    }
  }
}
