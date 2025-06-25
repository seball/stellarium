import { Injectable } from '@angular/core';
import OpenAI from 'openai';
import { environment } from '../../environments/environment';
import { FortuneTeller } from '../models/fortune-teller.model';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private client: OpenAI | null = null;

  constructor() {
    this.initializeClient();
  }

  private initializeClient(): void {
    const token = this.getGithubToken();
    if (token) {
      this.client = new OpenAI({
        baseURL: 'https://models.github.ai/inference',
        apiKey: token,
        dangerouslyAllowBrowser: true,
      });
    }
  }

  private getGithubToken(): string {
    return environment.githubToken;
  }

  async generateHoroscope(
    sign: string,
    date: string,
    fortuneTeller?: FortuneTeller
  ): Promise<string> {
    if (!this.client) {
      throw new Error(
        'Klient OpenAI nie został zainicjalizowany. Podaj token GitHub.'
      );
    }

    try {
      const systemContent =
        fortuneTeller?.systemPrompt ||
        'Jesteś sarkastycznym astrologiem który pisze horoskopy z przymrużeniem oka. Używasz nieformalnego języka polskiego, ironii i subtelnego humoru. Twoje horoskopy są zabawne ale nie złośliwe, z dozą cynizmu ale bez krzywdzenia czytelnika.';

      const prompt = `Napisz horoskop dla znaku ${sign} w wulgarnym stylu, na dzisiaj, ${date}. 
      Napisz o miłości, karierze i zdrowiu, ale bez szczęśliwych liczb. 
      Możesz napisać dłuższy tekst - nie krępuj się! Po polsku. 
      Tekst jest spersonalizowany więc unikaj zdań w liczbie mnogiej.'}`;

      const response = await this.client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: systemContent,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'openai/gpt-4o',
        temperature: 0.9,
        max_tokens: 2000,
        top_p: 1,
      });

      return (
        response.choices[0].message.content ||
        'Nie udało się wygenerować horoskopu w tym momencie.'
      );
    } catch (error) {
      console.error('Błąd podczas generowania horoskopu:', error);
      throw new Error(
        'Nie udało się wygenerować horoskopu. Spróbuj ponownie później.'
      );
    }
  }
}
