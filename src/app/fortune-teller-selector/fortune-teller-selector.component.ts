import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FortuneTeller, FORTUNE_TELLERS } from '../models/fortune-teller.model';

@Component({
  selector: 'app-fortune-teller-selector',
  imports: [CommonModule],
  templateUrl: './fortune-teller-selector.component.html',
  styleUrl: './fortune-teller-selector.component.scss',
})
export class FortuneTellerSelectorComponent {
  @Output() fortuneTellerSelected = new EventEmitter<FortuneTeller>();
  @Output() backToZodiac = new EventEmitter<void>();
  @Input() selectedFortuneTeller: FortuneTeller | null = null;

  fortuneTellers: FortuneTeller[] = FORTUNE_TELLERS;
  flippedCards: number[] = [];

  selectFortuneTeller(fortuneTeller: FortuneTeller): void {
    this.selectedFortuneTeller = fortuneTeller;
    this.fortuneTellerSelected.emit(fortuneTeller);
  }

  onCardClick(fortuneTeller: FortuneTeller, index: number, event: Event): void {
    const isMobile = this.isMobileDevice();
    console.log('Card clicked:', { isMobile, index, fortuneTeller: fortuneTeller.name });
    
    if (isMobile) {
      if (!this.flippedCards.includes(index)) {
        // First tap - close other cards and flip this one
        this.flippedCards = [index];
        return;
      } else {
        // Second tap - select fortune teller
        this.selectFortuneTeller(fortuneTeller);
      }
    } else {
      // Desktop - select immediately
      this.selectFortuneTeller(fortuneTeller);
    }
  }

  goBackToZodiac(): void {
    this.backToZodiac.emit();
  }

  private isMobileDevice(): boolean {
    // More accurate mobile detection - prioritize hover capability
    const hasHover = window.matchMedia('(hover: hover)').matches;
    const hasPointer = window.matchMedia('(pointer: fine)').matches;
    
    // If device has hover and fine pointer, it's desktop
    if (hasHover && hasPointer) {
      return false;
    }
    
    // Otherwise check touch capabilities
    return ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) ||
           (window.matchMedia('(hover: none)').matches);
  }
}