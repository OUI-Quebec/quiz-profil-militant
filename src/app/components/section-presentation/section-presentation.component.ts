import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Section } from '../../model/section';
import { LottieEmojiComponent } from '../lottie-emoji/lottie-emoji.component';

@Component({
  selector: 'app-section-presentation',
  standalone: true,
  imports: [CommonModule, LottieEmojiComponent],
  templateUrl: './section-presentation.component.html',
  styleUrl: './section-presentation.component.scss',
})
export class SectionPresentationComponent {
  readonly section = input.required<Section>();
  readonly numeroSection = input<number>(1);
  @Output() commencer = new EventEmitter<void>();

  @ViewChild('commencerSectionLottie')
  commencerSectionLottie!: LottieEmojiComponent;

  commencerSection(): void {
    this.commencer.emit();
  }

  onHoverCommencerSection(isHovering: boolean): void {
    if (this.commencerSectionLottie) {
      if (isHovering) {
        this.commencerSectionLottie.playAnimation();
      } else {
        this.commencerSectionLottie.stopAnimation();
      }
    }
  }
}
