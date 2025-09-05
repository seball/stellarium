import OpenAI from 'openai';

export default async function handler(req, res) {
  // CORS headers dla Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sign, date, fortuneTeller, personalityProfile } = req.body;

    if (!sign || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Inicjalizuj klientów AI z tokenami z zmiennych środowiskowych
    let client = null;
    let deepseekClient = null;

    if (process.env.GITHUB_TOKEN) {
      client = new OpenAI({
        baseURL: 'https://models.github.ai/inference',
        apiKey: process.env.GITHUB_TOKEN,
      });
    }

    if (process.env.DEEPSEEK_API_KEY) {
      deepseekClient = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY,
      });
    }

    if (!client && !deepseekClient) {
      return res.status(500).json({ 
        error: 'AI services not configured' 
      });
    }

    const systemContent = fortuneTeller?.systemPrompt || 
      'Jesteś sarkastycznym astrologiem który pisze horoskopy z przymrużeniem oka. Używasz nieformalnego języka polskiego, ironii i subtelnego humoru. Twoje horoskopy są zabawne ale nie złośliwe, z dozą cynizmu ale bez krzywdzenia czytelnika.';

    const personalityContext = personalityProfile 
      ? `\n\nInformacje o użytkowniku: ${personalityProfile} Uwzględnij te cechy w horoskopie, dostosuj rady i przewidywania do profilu osobowości użytkownika.`
      : '';

    // Ukryty kontekst personalizacji
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

    const messages = [
      {
        role: 'system',
        content: systemContent,
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    // Próbuj GitHub API pierwszy
    if (client) {
      try {
        const response = await client.chat.completions.create({
          messages,
          model: 'openai/gpt-4o',
          temperature: 0.9,
          max_tokens: 8000,
          top_p: 1,
        });

        const content = response.choices[0].message.content || 
          'Nie udało się wygenerować horoskopu w tym momencie.';

        return res.status(200).json({ horoscope: content });
      } catch (error) {
        console.error('GitHub API error:', error);
        
        // Jeśli 429, spróbuj DeepSeek
        if (error.status === 429 && deepseekClient) {
          try {
            const deepseekResponse = await deepseekClient.chat.completions.create({
              messages,
              model: 'deepseek-chat',
              temperature: 0.9,
              max_tokens: 8000,
              top_p: 1,
            });

            const content = deepseekResponse.choices[0].message.content || 
              'Nie udało się wygenerować horoskopu w tym momencie.';

            return res.status(200).json({ horoscope: content });
          } catch (deepseekError) {
            console.error('DeepSeek API error:', deepseekError);
            return res.status(500).json({ 
              error: 'Nie udało się wygenerować horoskopu. Spróbuj ponownie później.' 
            });
          }
        }

        return res.status(500).json({ 
          error: 'Nie udało się wygenerować horoskopu. Spróbuj ponownie później.' 
        });
      }
    }

    // Jeśli nie ma GitHub, próbuj DeepSeek
    if (deepseekClient) {
      try {
        const response = await deepseekClient.chat.completions.create({
          messages,
          model: 'deepseek-chat',
          temperature: 0.9,
          max_tokens: 4000,
          top_p: 1,
        });

        const content = response.choices[0].message.content || 
          'Nie udało się wygenerować horoskopu w tym momencie.';

        return res.status(200).json({ horoscope: content });
      } catch (error) {
        console.error('DeepSeek API error:', error);
        return res.status(500).json({ 
          error: 'Nie udało się wygenerować horoskopu. Spróbuj ponownie później.' 
        });
      }
    }

    return res.status(500).json({ 
      error: 'Nie udało się wygenerować horoskopu. Spróbuj ponownie później.' 
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Błąd serwera. Spróbuj ponownie później.' 
    });
  }
}