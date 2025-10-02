import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Section } from '../../model/section';

@Component({
  selector: 'app-section-presentation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-presentation.component.html',
  styleUrl: './section-presentation.component.scss',
})
export class SectionPresentationComponent {
  @Input() section: Section | null = null;
  @Input() numeroSection: number = 1;
  @Output() commencer = new EventEmitter<void>();

  commencerSection(): void {
    this.commencer.emit();
  }
}
