import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import lottie, { AnimationItem } from 'lottie-web';

@Component({
  selector: 'app-lottie-emoji',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #lottieContainer
      class="lottie-emoji"
      [style.width.px]="size"
      [style.height.px]="size"
    ></div>
  `,
  styles: [
    `
      .lottie-emoji {
        display: inline-block;
        vertical-align: middle;
      }
    `,
  ],
})
export class LottieEmojiComponent implements OnInit, OnDestroy, OnChanges {
  @Input() emojiCode: string = '';
  @Input() size: number = 48;
  @Input() loop: boolean = true;
  @Input() autoplay: boolean = true;

  @ViewChild('lottieContainer', { static: true }) lottieContainer!: ElementRef;

  private animation: AnimationItem | null = null;

  ngOnInit() {
    this.loadAnimation();
  }

  ngOnDestroy() {
    if (this.animation) {
      this.animation.destroy();
    }
  }

  ngOnChanges() {
    this.loadAnimation();
  }

  private loadAnimation() {
    if (this.animation) {
      this.animation.destroy();
    }

    if (!this.emojiCode) {
      return;
    }

    const animationUrl = `https://fonts.gstatic.com/s/e/notoemoji/latest/${this.emojiCode}/lottie.json`;

    this.animation = lottie.loadAnimation({
      container: this.lottieContainer.nativeElement,
      renderer: 'svg',
      loop: this.loop,
      autoplay: this.autoplay,
      path: animationUrl,
    });

    // Gestion d'erreur si l'emoji n'existe pas
    this.animation.addEventListener('data_failed', () => {
      console.warn(`Emoji Lottie non trouvé pour le code: ${this.emojiCode}`);
      // Fallback vers un emoji par défaut
      this.loadFallbackEmoji();
    });
  }

  private loadFallbackEmoji() {
    if (this.animation) {
      this.animation.destroy();
    }

    // Emoji par défaut : visage souriant (1f642)
    const fallbackUrl =
      'https://fonts.gstatic.com/s/e/notoemoji/latest/1f642/lottie.json';

    this.animation = lottie.loadAnimation({
      container: this.lottieContainer.nativeElement,
      renderer: 'svg',
      loop: this.loop,
      autoplay: this.autoplay,
      path: fallbackUrl,
    });
  }
}
