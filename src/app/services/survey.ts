import { Injectable } from '@angular/core';
import { SurveyAnswers } from '../survey/survey';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private readonly SURVEY_ANSWERS_KEY = 'surveyAnswers';
  private readonly SURVEY_COMPLETED_KEY = 'surveyCompleted';

  constructor() { }

  isSurveyCompleted(): boolean {
    return localStorage.getItem(this.SURVEY_COMPLETED_KEY) === 'true';
  }

  getSurveyAnswers(): SurveyAnswers | null {
    const answers = localStorage.getItem(this.SURVEY_ANSWERS_KEY);
    return answers ? JSON.parse(answers) : null;
  }

  saveSurveyAnswers(answers: SurveyAnswers): void {
    localStorage.setItem(this.SURVEY_ANSWERS_KEY, JSON.stringify(answers));
    localStorage.setItem(this.SURVEY_COMPLETED_KEY, 'true');
  }

  resetSurvey(): void {
    localStorage.removeItem(this.SURVEY_ANSWERS_KEY);
    localStorage.removeItem(this.SURVEY_COMPLETED_KEY);
  }

  getPersonalityProfile(): string {
    const answers = this.getSurveyAnswers();
    if (!answers) return '';

    const avgScore = Object.values(answers).reduce((sum, val) => sum + val, 0) / Object.values(answers).length;
    
    // Personality traits based on survey answers
    const traits = [];
    
    if (answers['optimism'] >= 4) traits.push('optymistyczny');
    if (answers['planning'] >= 4) traits.push('zorganizowany');
    if (answers['intuition'] >= 4) traits.push('intuicyjny');
    if (answers['social'] >= 4) traits.push('towarzyski');
    if (answers['change'] >= 4) traits.push('elastyczny');
    if (answers['spiritual'] >= 4) traits.push('duchowy');
    if (answers['risk'] >= 4) traits.push('odważny');
    if (answers['tradition'] >= 4) traits.push('tradycyjny');
    if (answers['analytical'] >= 4) traits.push('analityczny');
    if (answers['creative'] >= 4) traits.push('kreatywny');

    // Overall personality type
    let personalityType = '';
    if (avgScore >= 4) {
      personalityType = 'bardzo pozytywnie nastawiony do życia, otwarty na nowe doświadczenia';
    } else if (avgScore >= 3) {
      personalityType = 'zrównoważony, poszukujący harmonii';
    } else {
      personalityType = 'ostrożny, preferujący stabilność i przewidywalność';
    }

    return `Użytkownik jest osobą ${personalityType}. Główne cechy: ${traits.join(', ')}.`;
  }
}