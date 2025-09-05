import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FortuneTeller } from '../models/fortune-teller.model';
import { SurveyService } from './survey';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private apiUrl = '/api/horoscope'; // Vercel serverless function

  constructor(
    private http: HttpClient,
    private surveyService: SurveyService
  ) {}

  async generateHoroscope(
    sign: string,
    date: string,
    fortuneTeller?: FortuneTeller
  ): Promise<string> {
    try {
      // Get personality profile from survey
      const personalityProfile = this.surveyService.getPersonalityProfile();

      const requestBody = {
        sign,
        date,
        fortuneTeller,
        personalityProfile
      };

      const response = await firstValueFrom(
        this.http.post<{ horoscope: string }>(
          this.apiUrl,
          requestBody
        )
      );

      return response.horoscope || 'Nie udało się wygenerować horoskopu w tym momencie.';
    } catch (error: any) {
      console.error('Błąd podczas generowania horoskopu:', error);
      
      // Handle different error types
      if (error.status === 429) {
        throw new Error('Zbyt wiele zapytań. Spróbuj ponownie za chwilę.');
      } else if (error.status >= 500) {
        throw new Error('Błąd serwera. Spróbuj ponownie później.');
      } else if (error.status === 0) {
        throw new Error('Brak połączenia z internetem.');
      } else {
        throw new Error(error.error?.error || 'Nie udało się wygenerować horoskopu. Spróbuj ponownie później.');
      }
    }
  }
}
