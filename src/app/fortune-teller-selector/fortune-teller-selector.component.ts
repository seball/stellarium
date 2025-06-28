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
    console.log('Card clicked:', { 
      isMobile, 
      index, 
      fortuneTeller: fortuneTeller.name,
      flippedCards: this.flippedCards,
      isFlipped: this.flippedCards.includes(index)
    });
    
    if (isMobile) {
      if (!this.flippedCards.includes(index)) {
        // First tap - close other cards and flip this one
        this.flippedCards = [index];
        console.log('Card flipped, new flippedCards:', this.flippedCards);
        return;
      } else {
        // Second tap - select fortune teller
        console.log('Second tap, selecting fortune teller');
        this.selectFortuneTeller(fortuneTeller);
      }
    } else {
      // Desktop - select immediately
      console.log('Desktop - selecting immediately');
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
    const hasTouch = 'ontouchstart' in window;
    const maxTouchPoints = navigator.maxTouchPoints > 0;
    const hoverNone = window.matchMedia('(hover: none)').matches;
    
    console.log('Mobile detection:', {
      hasHover,
      hasPointer,
      hasTouch,
      maxTouchPoints,
      hoverNone,
      userAgent: navigator.userAgent
    });
    
    // If device has hover and fine pointer, it's desktop
    if (hasHover && hasPointer) {
      return false;
    }
    
    // Otherwise check touch capabilities
    return hasTouch || maxTouchPoints || hoverNone;
  }
}