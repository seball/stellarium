import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZodiacSelector } from '../zodiac-selector/zodiac-selector';
import { FortuneTellerSelectorComponent } from '../fortune-teller-selector/fortune-teller-selector.component';
import { StarTransitionComponent } from '../star-transition/star-transition.component';
import { OpenAIService } from '../services/openai.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { FortuneTeller, FORTUNE_TELLERS } from '../models/fortune-teller.model';

interface HoroscopeData {
  sign: string;
  date: string;
  horoscope: string;
  fortuneTellerId?: string;
  userSelectedSign?: boolean;
}

@Component({
  selector: 'app-horoscope',
  imports: [CommonModule, ZodiacSelector, FortuneTellerSelectorComponent, StarTransitionComponent],
  templateUrl: './horoscope.html',
  styleUrl: './horoscope.scss',
})
export class HoroscopeComponent implements OnInit {
  selectedSign: string | null = null;
  selectedFortuneTeller: FortuneTeller | null = null;
  horoscopeText: string = '';
  horoscopeHtml: SafeHtml = '';
  isLoading: boolean = false;
  hasReachedLimit: boolean = false;
  errorMessage: string = '';
  hasSelectedSignBefore: boolean = false;
  hasSelectedFortuneTellerBefore: boolean = false;
  showFortuneTellerSelector: boolean = false;
  showStarTransition: boolean = false;
  todayDate: string = new Date().toLocaleDateString('pl-PL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  constructor(private openAIService: OpenAIService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.checkDailyLimit();
  }

  async checkDailyLimit(): Promise<void> {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('horoscope_data');
    const userSignData = localStorage.getItem('user_zodiac_sign');
    const userFortuneTellerData = localStorage.getItem('user_fortune_teller');

    // Sprawdź czy użytkownik już wybrał znak zodiaku
    if (userSignData) {
      this.hasSelectedSignBefore = true;
      this.selectedSign = userSignData;
    }

    // Sprawdź czy użytkownik już wybrał wróżbitę
    if (userFortuneTellerData) {
      this.hasSelectedFortuneTellerBefore = true;
      const fortuneTeller = FORTUNE_TELLERS.find(ft => ft.id === userFortuneTellerData);
      this.selectedFortuneTeller = fortuneTeller || null;
    }

    if (storedData) {
      const data: HoroscopeData = JSON.parse(storedData);
      if (data.date === today) {
        this.hasReachedLimit = true;
        this.selectedSign = data.sign;
        this.horoscopeText = data.horoscope;
        
        // Sprawdź czy mamy zapisanego wróżbitę z tego horoskopu
        if (data.fortuneTellerId && !this.selectedFortuneTeller) {
          const fortuneTeller = FORTUNE_TELLERS.find(ft => ft.id === data.fortuneTellerId);
          this.selectedFortuneTeller = fortuneTeller || null;
        }
        
        // Parsuj zapisany horoskop do HTML
        this.parseMarkdownToHtml(this.horoscopeText);
      }
    }
  }

  async onSignSelected(sign: string): Promise<void> {
    this.selectedSign = sign;
    
    // Zapisz znak zodiaku użytkownika na stałe
    if (!this.hasSelectedSignBefore) {
      localStorage.setItem('user_zodiac_sign', sign);
      this.hasSelectedSignBefore = true;
    }
    
    // Pokaż animację gwiazd
    this.showStarTransition = true;
  }

  onStarAnimationComplete(): void {
    this.showStarTransition = false;
    
    // Pokaż wybór wróżbity jeśli nie wybrano wcześniej
    if (!this.hasSelectedFortuneTellerBefore) {
      this.showFortuneTellerSelector = true;
    } else {
      // Jeśli wróżbita już wybrany, od razu generuj horoskop
      this.generateHoroscope();
    }
  }

  onFortuneTellerSelected(fortuneTeller: FortuneTeller): void {
    this.selectedFortuneTeller = fortuneTeller;
    
    // Zapisz wróżbitę na stałe
    if (!this.hasSelectedFortuneTellerBefore) {
      localStorage.setItem('user_fortune_teller', fortuneTeller.id);
      this.hasSelectedFortuneTellerBefore = true;
    }
    
    this.showFortuneTellerSelector = false;
    this.generateHoroscope();
  }

  async generateHoroscope(): Promise<void> {
    if (this.hasReachedLimit) {
      this.errorMessage = 'Już otrzymałeś dziś swój horoskop. Wróć jutro!';
      return;
    }

    if (!this.selectedSign) {
      this.errorMessage = 'Najpierw wybierz znak zodiaku.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.horoscopeText = await this.openAIService.generateHoroscope(
        this.selectedSign, 
        this.todayDate, 
        this.selectedFortuneTeller || undefined
      );
      
      // Parsuj markdown do HTML
      await this.parseMarkdownToHtml(this.horoscopeText);

      // Zapisz horoskop na dziś
      const horoscopeData: HoroscopeData = {
        sign: this.selectedSign,
        date: new Date().toDateString(),
        horoscope: this.horoscopeText,
        fortuneTellerId: this.selectedFortuneTeller?.id,
        userSelectedSign: true
      };

      localStorage.setItem('horoscope_data', JSON.stringify(horoscopeData));
      this.hasReachedLimit = true;
    } catch (error) {
      console.error('Błąd podczas generowania horoskopu:', error);
      this.errorMessage = 'Nie udało się wygenerować horoskopu. Spróbuj ponownie.';
    } finally {
      this.isLoading = false;
    }
  }

  resetSelection(): void {
    if (!this.hasReachedLimit && !this.hasSelectedSignBefore) {
      this.selectedSign = null;
      this.horoscopeText = '';
      this.errorMessage = '';
    }
  }

  private async parseMarkdownToHtml(text: string): Promise<void> {
    try {
      const htmlContent = await marked(text);
      this.horoscopeHtml = this.sanitizer.bypassSecurityTrustHtml(htmlContent);
    } catch (error) {
      console.error('Błąd podczas parsowania markdown:', error);
      // Fallback - użyj zwykłego tekstu
      this.horoscopeHtml = this.sanitizer.bypassSecurityTrustHtml(`<p>${text}</p>`);
    }
  }

  clearUserData(): void {
    // Funkcja do usuwania danych użytkownika (dla testów)
    localStorage.removeItem('user_zodiac_sign');
    localStorage.removeItem('user_fortune_teller');
    localStorage.removeItem('horoscope_data');
    this.hasSelectedSignBefore = false;
    this.hasSelectedFortuneTellerBefore = false;
    this.hasReachedLimit = false;
    this.selectedSign = null;
    this.selectedFortuneTeller = null;
    this.horoscopeText = '';
    this.horoscopeHtml = '';
    this.errorMessage = '';
    this.showFortuneTellerSelector = false;
    this.showStarTransition = false;
  }
}
