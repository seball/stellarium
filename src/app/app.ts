import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HoroscopeComponent } from './horoscope/horoscope';
import { NgParticlesService, NgxParticlesModule } from '@tsparticles/angular';
import { Engine, ParticlesOptions } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { Survey } from './survey/survey';
import { SurveyService } from './services/survey';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HoroscopeComponent, NgxParticlesModule, Survey, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected title = 'Stellarium';
  showSurvey = false;

  id = 'tsparticles';

  particlesOptions: any = {
    particles: {
      number: {
        value: 150,
        density: {
          enable: true,
          area: 400,
        },
      },
      color: {
        value: '#ffffff',
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: {
          min: 0.1,
          max: 0.8
        },
        random: true,
        animation: {
          enable: true,
          speed: {
            min: 1,
            max: 5
          },
          minimumValue: 0.1,
          sync: false
        }
      },
      size: {
        value: {
          min: 0.5,
          max: 4,
        },
        random: true,
        animation: {
          enable: true,
          speed: {
            min: 1,
            max: 4,
          },
          minimumValue: 0.1,
          sync: false,
        },
      },
      move: {
        enable: true,
        speed: {
          min: 0.5,
          max: 2,
        },
        direction: 'none',
        random: false,
        straight: false,
        outModes: {
          default: 'out',
        },
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detectsOn: 'canvas',
      events: {
        onHover: {
          enable: false,
        },
        onClick: {
          enable: false,
        },
        resize: false,
      },
    },
    detectRetina: true,
  };

  constructor(
    private readonly ngParticlesService: NgParticlesService,
    private surveyService: SurveyService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.ngParticlesService.init(async (engine: Engine) => {
      await loadSlim(engine);
    });

    // Check if survey should be shown
    if (!this.surveyService.isSurveyCompleted()) {
      this.showSurvey = true;
    }
  }

  onSurveyCompleted(): void {
    this.showSurvey = false;
  }

  particlesLoaded(container: any): void {
    console.log(container);
  }
}
