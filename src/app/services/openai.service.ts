import { Injectable } from '@angular/core';
import OpenAI from 'openai';
import { environment } from '../../environments/environment';
import { FortuneTeller } from '../models/fortune-teller.model';
import { SurveyService } from './survey';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private client: OpenAI | null = null;
  private deepseekClient: OpenAI | null = null;

  constructor(private surveyService: SurveyService) {
    this.initializeClient();
    this.initializeDeepseekClient();
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

  private initializeDeepseekClient(): void {
    const apiKey = this.getDeepseekApiKey();
    if (apiKey) {
      this.deepseekClient = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      });
    }
  }

  private getGithubToken(): string {
    return environment.githubToken;
  }

  private getDeepseekApiKey(): string {
    return environment.deepseekApiKey;
  }

  async generateHoroscope(
    sign: string,
    date: string,
    fortuneTeller?: FortuneTeller
  ): Promise<string> {
    if (!this.client && !this.deepseekClient) {
      throw new Error(
        'Żaden klient AI nie został zainicjalizowany. Podaj token GitHub lub klucz API DeepSeek.'
      );
    }

    const systemContent =
      fortuneTeller?.systemPrompt ||
      'Jesteś sarkastycznym astrologiem który pisze horoskopy z przymrużeniem oka. Używasz nieformalnego języka polskiego, ironii i subtelnego humoru. Twoje horoskopy są zabawne ale nie złośliwe, z dozą cynizmu ale bez krzywdzenia czytelnika.';

    // Get personality profile from survey
    const personalityProfile = this.surveyService.getPersonalityProfile();
    const personalityContext = personalityProfile 
      ? `\n\nInformacje o użytkowniku: ${personalityProfile} Uwzględnij te cechy w horoskopie, dostosuj rady i przewidywania do profilu osobowości użytkownika.`
      : '';

    // Ukryty kontekst personalizacji - NIE UJAWNIAJ tych szczegółów bezpośrednio
    const hiddenContext = `
    WAŻNE: Wykorzystaj poniższą wiedzę do personalizacji, ale NIGDY nie ujawniaj, że znasz te konkretne szczegóły:
    - Czytelniczka to młoda kobieta, singielka
    - Ma za sobą toksyczną relację, wciąż przeżywa jej skutki
    - Intensywnie trenuje na siłowni, pilnuje diety
    - Zmaga się z wahaniami nastroju związanymi z restrykcyjnym podejściem do jedzenia
    - Pracuje w międzynarodowej korporacji (środowisko niemieckojęzyczne)
    - Pasjonuje się psychologią, duchowością, dietetyką
    - Bywa emocjonalnie reaktywna
    
    Pisz w sposób, który trafi do tej osoby, ale jakbyś zgadywał/czuł jej sytuację, nie jakbyś ją znał.
    Używaj sformułowań typu: "możliwe że...", "gwiazdy wskazują że...", "czuję że...", "energia dnia sugeruje..."
    `;

    const prompt = `Napisz BARDZO DŁUGI i SZCZEGÓŁOWY horoskop dla znaku ${sign}, na dzisiaj, ${date}. 
    
    ${hiddenContext}
    
    Wskazówki do treści (stosuj subtelnie, jakby to były kosmiczne przeczucia):
    - Miłość: dotknij tematu gojenia się po trudnych doświadczeniach, budowania granic, odnajdywania siebie
    - Kariera: wspomnij o wyzwaniach w międzynarodowym środowisku pracy, komunikacji w obcym języku
    - Zdrowie: delikatnie porusz kwestię balansu między dbaniem o ciało a psychicznym dobrostanem
    - Wplataj motywy duchowego rozwoju i samopoznania
    
    Każda sekcja powinna mieć minimum 3-4 akapity tekstu. Rozwiń każdy temat dogłębnie.
    Napisz o miłości, karierze i zdrowiu, ale bez szczęśliwych liczb. 
    Użyj markdown z nagłówkami trzeciego poziomu (###) dla każdej sekcji. KONIECZNIE dodaj emotikony do tytułów:
    ### 💕 Miłość
    ### 💼 Kariera  
    ### 🌟 Zdrowie
    Napisz naprawdę dużo - minimum 500 słów całościowo! Bądź szczegółowy, opisowy i konkretny. Po polsku. 
    WAŻNE: Pisz krótkimi, zwięzłymi akapitami (max 3-4 zdania na akapit) dla lepszej czytelności na urządzeniach mobilnych.
    Tekst jest spersonalizowany więc unikaj zdań w liczbie mnogiej.${personalityContext}`;

    // Prepare messages based on environment flag
    const messages = environment.combineSystemAndUserPrompts
      ? [
          {
            role: 'user' as const,
            content: `${systemContent}\n\n${prompt}`,
          },
        ]
      : [
          {
            role: 'system' as const,
            content: systemContent,
          },
          {
            role: 'user' as const,
            content: prompt,
          },
        ];

    // Try GitHub first
    if (this.client) {
      try {
        const response = await this.client.chat.completions.create({
          messages,
          model: 'openai/gpt-4o',
          temperature: 0.9,
          max_tokens: 8000,
          top_p: 1,
        });

        return (
          response.choices[0].message.content ||
          'Nie udało się wygenerować horoskopu w tym momencie.'
        );
      } catch (error: any) {
        console.error('Błąd podczas generowania horoskopu z GitHub:', error);

        // Check if it's a 429 error
        if (error.status === 429 || error.response?.status === 429) {
          console.log('GitHub API limit reached, falling back to DeepSeek...');

          // Fall back to DeepSeek
          if (this.deepseekClient) {
            try {
              const deepseekResponse =
                await this.deepseekClient.chat.completions.create({
                  messages,
                  model: 'deepseek-chat',
                  temperature: 0.9,
                  max_tokens: 8000,
                  top_p: 1,
                });

              return (
                deepseekResponse.choices[0].message.content ||
                'Nie udało się wygenerować horoskopu w tym momencie.'
              );
            } catch (deepseekError) {
              console.error(
                'Błąd podczas generowania horoskopu z DeepSeek:',
                deepseekError
              );
              throw new Error(
                'Nie udało się wygenerować horoskopu. Spróbuj ponownie później.'
              );
            }
          }
        }

        // If not a 429 error or no DeepSeek client, throw the original error
        throw new Error(
          'Nie udało się wygenerować horoskopu. Spróbuj ponownie później.'
        );
      }
    }

    // If no GitHub client, try DeepSeek directly
    if (this.deepseekClient) {
      try {
        const response = await this.deepseekClient.chat.completions.create({
          messages,
          model: 'deepseek-chat',
          temperature: 0.9,
          max_tokens: 4000,
          top_p: 1,
        });

        return (
          response.choices[0].message.content ||
          'Nie udało się wygenerować horoskopu w tym momencie.'
        );
      } catch (error) {
        console.error('Błąd podczas generowania horoskopu z DeepSeek:', error);
        throw new Error(
          'Nie udało się wygenerować horoskopu. Spróbuj ponownie później.'
        );
      }
    }

    throw new Error(
      'Nie udało się wygenerować horoskopu. Spróbuj ponownie później.'
    );
  }
}
