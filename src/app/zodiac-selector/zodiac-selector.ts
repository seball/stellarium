import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

interface ZodiacSign {
  name: string;
  symbol: string;
  dateRange: string;
  element: string;
  spritePosition: { x: number; y: number };
  backgroundColor: string;
}

@Component({
  selector: 'app-zodiac-selector',
  imports: [CommonModule, CarouselModule],
  templateUrl: './zodiac-selector.html',
  styleUrl: './zodiac-selector.scss',
})
export class ZodiacSelector {
  @Output() signSelected = new EventEmitter<string>();
  selectedSign: string | null = null;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['‹', '›'],
    center: true,
    items: 3,
    stagePadding: 0,
    margin: 10,
    nav: true
  };

  zodiacSigns: ZodiacSign[] = [
    {
      name: 'Baran',
      symbol: '♈',
      dateRange: '21 mar - 19 kwi',
      element: 'fire',
      spritePosition: { x: 0, y: 0 },
      backgroundColor: '#564592',
    },
    {
      name: 'Byk',
      symbol: '♉',
      dateRange: '20 kwi - 20 maj',
      element: 'earth',
      spritePosition: { x: 1, y: 0 },
      backgroundColor: '#724CF9',
    },
    {
      name: 'Bliźnięta',
      symbol: '♊',
      dateRange: '21 maj - 20 cze',
      element: 'air',
      spritePosition: { x: 2, y: 0 },
      backgroundColor: '#CA7DF9',
    },
    {
      name: 'Rak',
      symbol: '♋',
      dateRange: '21 cze - 22 lip',
      element: 'water',
      spritePosition: { x: 3, y: 0 },
      backgroundColor: '#F896D8',
    },
    {
      name: 'Lew',
      symbol: '♌',
      dateRange: '23 lip - 22 sie',
      element: 'fire',
      spritePosition: { x: 4, y: 0 },
      backgroundColor: '#EDF67D',
    },
    {
      name: 'Panna',
      symbol: '♍',
      dateRange: '23 sie - 22 wrz',
      element: 'earth',
      spritePosition: { x: 5, y: 0 },
      backgroundColor: '#FFFFFF',
    },
    {
      name: 'Waga',
      symbol: '♎',
      dateRange: '23 wrz - 22 paź',
      element: 'air',
      spritePosition: { x: 0, y: 1 },
      backgroundColor: '#F896D8',
    },
    {
      name: 'Skorpion',
      symbol: '♏',
      dateRange: '23 paź - 21 lis',
      element: 'water',
      spritePosition: { x: 1, y: 1 },
      backgroundColor: '#FFFFFF',
    },
    {
      name: 'Strzelec',
      symbol: '♐',
      dateRange: '22 lis - 21 gru',
      element: 'fire',
      spritePosition: { x: 2, y: 1 },
      backgroundColor: '#EDF67D',
    },
    {
      name: 'Koziorożec',
      symbol: '♑',
      dateRange: '22 gru - 19 sty',
      element: 'earth',
      spritePosition: { x: 3, y: 1 },
      backgroundColor: '#724CF9',
    },
    {
      name: 'Wodnik',
      symbol: '♒',
      dateRange: '20 sty - 18 lut',
      element: 'air',
      spritePosition: { x: 4, y: 1 },
      backgroundColor: '#564592',
    },
    {
      name: 'Ryby',
      symbol: '♓',
      dateRange: '19 lut - 20 mar',
      element: 'water',
      spritePosition: { x: 5, y: 1 },
      backgroundColor: '#CA7DF9',
    },
  ];


  selectSign(sign: string): void {
    this.selectedSign = sign;
    this.signSelected.emit(sign);
  }


  getSpritePosition(spritePosition: { x: number; y: number }): string {
    // Obrazek ma wymiary 3000x2000, podzielony na 6x2 = 12 części
    // Każda część ma 500x1000 pikseli
    const spriteWidth = 500;
    const spriteHeight = 1000;
    const totalWidth = 3000;
    const totalHeight = 2000;

    // Oblicz pozycję w procentach
    const xPercent =
      ((spritePosition.x * spriteWidth) / (totalWidth - spriteWidth)) * 100;
    const yPercent =
      ((spritePosition.y * spriteHeight) / (totalHeight - spriteHeight)) * 100;

    return `${xPercent}% ${yPercent}%`;
  }
}
