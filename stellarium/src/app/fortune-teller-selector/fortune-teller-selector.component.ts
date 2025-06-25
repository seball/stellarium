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
  @Input() selectedFortuneTeller: FortuneTeller | null = null;

  fortuneTellers: FortuneTeller[] = FORTUNE_TELLERS;

  selectFortuneTeller(fortuneTeller: FortuneTeller): void {
    this.selectedFortuneTeller = fortuneTeller;
    this.fortuneTellerSelected.emit(fortuneTeller);
  }
}