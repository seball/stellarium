import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SurveyQuestion {
  id: string;
  question: string;
  category: 'personality' | 'lifestyle' | 'beliefs' | 'preferences';
}

export interface SurveyAnswers {
  [key: string]: number;
}

@Component({
  selector: 'app-survey',
  imports: [CommonModule, FormsModule],
  templateUrl: './survey.html',
  styleUrl: './survey.scss'
})
export class Survey {
  @Output() surveyCompleted = new EventEmitter<SurveyAnswers>();

  questions: SurveyQuestion[] = [
    { id: 'optimism', question: 'Jestem osobą optymistyczną i pozytywnie nastawioną do życia', category: 'personality' },
    { id: 'planning', question: 'Lubię planować swoją przyszłość i wyznaczać cele', category: 'lifestyle' },
    { id: 'intuition', question: 'Często kieruję się intuicją w podejmowaniu decyzji', category: 'beliefs' },
    { id: 'social', question: 'Jestem osobą towarzyską i lubię spędzać czas z innymi', category: 'personality' },
    { id: 'change', question: 'Dobrze radzę sobie ze zmianami i nowymi sytuacjami', category: 'personality' },
    { id: 'spiritual', question: 'Interesuję się duchowością i rozwojem osobistym', category: 'beliefs' },
    { id: 'risk', question: 'Lubię podejmować ryzyko i szukać nowych doświadczeń', category: 'lifestyle' },
    { id: 'tradition', question: 'Cenię tradycję i stabilność w życiu', category: 'beliefs' },
    { id: 'analytical', question: 'Podchodzę do problemów w sposób analityczny i logiczny', category: 'personality' },
    { id: 'creative', question: 'Jestem osobą kreatywną i lubię wyrażać siebie', category: 'preferences' }
  ];

  answers: SurveyAnswers = {};
  currentQuestionIndex = 0;

  scaleOptions = [
    { value: 1, label: 'Zdecydowanie się nie zgadzam' },
    { value: 2, label: 'Nie zgadzam się' },
    { value: 3, label: 'Neutralnie' },
    { value: 4, label: 'Zgadzam się' },
    { value: 5, label: 'Zdecydowanie się zgadzam' }
  ];

  get currentQuestion(): SurveyQuestion {
    return this.questions[this.currentQuestionIndex];
  }

  get progress(): number {
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }

  selectAnswer(value: number): void {
    this.answers[this.currentQuestion.id] = value;
    
    if (this.currentQuestionIndex < this.questions.length - 1) {
      setTimeout(() => {
        this.currentQuestionIndex++;
      }, 300);
    } else {
      setTimeout(() => {
        this.completeSurvey();
      }, 300);
    }
  }

  goToQuestion(index: number): void {
    // Allow navigation only to answered questions or the next unanswered one
    if (index <= this.currentQuestionIndex || this.answers[this.questions[index - 1]?.id] !== undefined) {
      this.currentQuestionIndex = index;
    }
  }

  private completeSurvey(): void {
    localStorage.setItem('surveyAnswers', JSON.stringify(this.answers));
    localStorage.setItem('surveyCompleted', 'true');
    this.surveyCompleted.emit(this.answers);
  }
}