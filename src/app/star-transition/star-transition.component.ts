import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-transition',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="star-transition" [class.active]="isActive">
      <canvas #starCanvas></canvas>
      <div class="constellation-name" [class.animate]="isActive">
        {{ zodiacSign }}
      </div>
    </div>
  `,
  styleUrls: ['./star-transition.component.scss'],
})
export class StarTransitionComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('starCanvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() zodiacSign: string = '';
  @Input() isActive: boolean = false;
  @Output() animationComplete = new EventEmitter<void>();

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private constellationStars: Star[] = [];
  private animationId: number = 0;
  private animationProgress: number = 0;

  ngOnInit() {
    setTimeout(() => {
      this.initCanvas();
      if (this.isActive) {
        this.startAnimation();
      }
    });
  }

  ngOnChanges() {
    if (this.isActive) {
      setTimeout(() => {
        this.initCanvas();
        this.startAnimation();
      });
    }
  }

  private initCanvas() {
    if (!this.canvasRef || !this.canvasRef.nativeElement) {
      console.error('Canvas ref not available');
      return;
    }

    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;

    if (!this.ctx) {
      console.error('Could not get canvas context');
      return;
    }

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private startAnimation() {
    if (!this.ctx) {
      console.error('Cannot start animation - no context');
      return;
    }

    this.animationProgress = 0;
    this.createStars();
    this.createConstellation();
    this.animate();

    setTimeout(() => {
      this.animationComplete.emit();
    }, 2000);
  }

  private createStars() {
    this.stars = [];
    const starCount = 200;

    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2,
        opacity: Math.random(),
        speed: Math.random() * 0.5 + 0.1,
        targetX: this.canvas.width / 2,
        targetY: this.canvas.height / 2,
      });
    }
  }

  private constellationEdges: [number, number][] = [];

  private createConstellation() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = 150;

    this.constellationStars = [];
    const constellation = this.getZodiacConstellation(this.zodiacSign);
    this.constellationEdges = constellation.edges;

    constellation.points.forEach((point) => {
      this.constellationStars.push({
        x: centerX + point.x * radius,
        y: centerY + point.y * radius,
        size: 3 + Math.random() * 2,
        opacity: 0,
        speed: 0,
        targetX: centerX + point.x * radius,
        targetY: centerY + point.y * radius,
      });
    });
  }

  private getZodiacConstellation(sign: string): {
    points: { x: number; y: number }[];
    edges: [number, number][];
  } {
    // Mapowanie polskich nazw na angielskie klucze
    const signMapping: Record<string, string> = {
      baran: 'aries',
      byk: 'taurus',
      bliźnięta: 'gemini',
      rak: 'cancer',
      lew: 'leo',
      panna: 'virgo',
      waga: 'libra',
      skorpion: 'scorpio',
      strzelec: 'sagittarius',
      koziorożec: 'capricorn',
      wodnik: 'aquarius',
      ryby: 'pisces',
    };

    const englishSign = signMapping[sign.toLowerCase()] || 'aries';

    // Definicje konstelacji z punktami i krawędziami (połączeniami)
    const constellations: Record<
      string,
      { points: { x: number; y: number }[]; edges: [number, number][] }
    > = {
      aries: {
        points: [
          { x: -1.003, y: 0.256 },
          { x: -0.704, y: -0.561 },
          { x: 0.53, y: -0.037 },
          { x: 0.887, y: 0.265 },
          { x: 1.003, y: 0.563 },
        ],
        edges: [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
        ],
      },
      taurus: {
        points: [
          { x: -1.0, y: -0.152 },
          { x: -0.242, y: 0.131 },
          { x: 0.008, y: 0.188 },
          { x: 0.265, y: 0.229 },
          { x: 0.591, y: 0.377 },
          { x: 0.985, y: 0.402 },
          { x: 1.0, y: 0.666 },
          { x: 0.159, y: 0.017 },
          { x: -0.011, y: -0.131 },
          { x: -0.697, y: -0.664 },
        ],
        edges: [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 5],
          [4, 6],
          [3, 7],
          [7, 8],
          [8, 9],
        ],
      },
      gemini: {
        points: [
          { x: 0.299, y: 0.893 },
          { x: 0.499, y: 0.536 },
          { x: -0.123, y: 0.169 },
          { x: -0.479, y: 0.056 },
          { x: -1.0, y: -0.562 },
          { x: -0.68, y: -0.893 },
          { x: 0.29, y: -0.299 },
          { x: 0.749, y: -0.048 },
          { x: 1.0, y: -0.065 },
        ],
        edges: [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 5],
          [5, 6],
          [6, 7],
          [7, 8],
        ],
      },
      cancer: {
        points: [
          { x: 0.446, y: 0.446 },
          { x: -0.002, y: -0.091 },
          { x: -0.314, y: -0.223 },
          { x: -1.0, y: -0.361 },
          { x: 1.0, y: -0.443 },
        ],
        edges: [
          [1, 0],
          [1, 4],
          [1, 2],
          [2, 3],
        ],
      },
      leo: {
        points: [
          { x: -1.0, y: 0.267 },
          { x: -0.424, y: 0.244 },
          { x: 0.613, y: 0.483 },
          { x: 0.654, y: 0.159 },
          { x: 0.425, y: -0.048 },
          { x: 0.511, y: -0.282 },
          { x: 0.817, y: -0.483 },
          { x: 1.0, y: -0.286 },
          { x: -0.391, y: -0.104 },
        ],
        edges: [
          [0, 8],
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 8],
          [4, 5],
          [5, 6],
          [6, 7],
        ],
      },
      virgo: {
        points: [
          { x: -0.949, y: 0.273 },
          { x: -0.089, y: 0.495 },
          { x: 0.071, y: 0.251 },
          { x: -0.206, y: 0.011 },
          { x: -1.0, y: -0.084 },
          { x: 0.154, y: -0.489 },
          { x: 0.227, y: -0.156 },
          { x: 0.368, y: 0.069 },
          { x: 0.63, y: 0.04 },
          { x: 0.952, y: -0.051 },
          { x: 1.0, y: -0.301 },
        ],
        edges: [
          [4, 3],
          [3, 2],
          [1, 2],
          [1, 0],
          [2, 7],
          [7, 6],
          [6, 3],
          [6, 5],
          [7, 8],
          [8, 9],
          [9, 10],
        ],
      },
      libra: {
        points: [
          { x: -1.0, y: 0.564 },
          { x: -0.66, y: 0.11 },
          { x: -0.643, y: 0.674 },
          { x: -0.951, y: -0.541 },
          { x: 0.082, y: -0.842 },
          { x: 0.837, y: -0.049 },
          { x: 0.661, y: 0.813 },
          { x: 1.0, y: 0.839 },
        ],
        edges: [
          [0, 1],
          [1, 2],
          [1, 3],
          [3, 4],
          [4, 5],
          [5, 6],
          [5, 7],
        ],
      },
      scorpio: {
        points: [
          { x: -1.0, y: -0.161 },
          { x: -0.75, y: -0.086 },
          { x: -0.932, y: 0.075 },
          { x: -1.0, y: 0.362 },
          { x: -0.7, y: 0.492 },
          { x: -0.384, y: 0.507 },
          { x: -0.246, y: 0.276 },
          { x: -0.123, y: 0.034 },
          { x: 0.224, y: -0.216 },
          { x: 0.418, y: -0.309 },
          { x: 0.597, y: -0.284 },
          { x: 1.0, y: -0.507 },
          { x: 0.972, y: -0.289 },
          { x: 0.857, y: -0.037 },
        ],
        edges: [
          [0, 2],
          [2, 1],
          [2, 3],
          [3, 4],
          [4, 5],
          [5, 6],
          [6, 7],
          [7, 8],
          [8, 9],
          [9, 10],
          [10, 13],
          [10, 12],
          [10, 11],
        ],
      },
      sagittarius: {
        points: [
          { x: -0.29, y: 0.574 },
          { x: -0.519, y: 0.413 },
          { x: -0.357, y: 0.158 },
          { x: -0.087, y: 0.064 },
          { x: -0.796, y: -0.183 },
          { x: -0.721, y: -0.364 },
          { x: -1.0, y: -0.187 },
          { x: 0.208, y: -0.274 },
          { x: 0.288, y: -0.764 },
          { x: 0.597, y: 0.09 },
          { x: 0.932, y: -0.049 },
          { x: 0.76, y: 0.566 },
          { x: 1.0, y: 0.763 },
        ],
        edges: [
          [0, 1],
          [1, 2],
          [2, 4],
          [4, 6],
          [4, 5],
          [2, 3],
          [3, 7],
          [7, 8],
          [7, 9],
          [9, 10],
          [9, 11],
          [11, 12],
        ],
      },
      capricorn: {
        points: [
          { x: 0.157, y: 0.617 },
          { x: 0.596, y: -0.137 },
          { x: 0.805, y: -0.402 },
          { x: 1.0, y: -0.618 },
          { x: -0.128, y: -0.209 },
          { x: -0.472, y: -0.233 },
          { x: -0.781, y: -0.241 },
          { x: -1.0, y: -0.292 },
          { x: -0.553, y: 0.253 },
        ],
        edges: [
          [0, 1],
          [1, 2],
          [2, 3],
          [2, 4],
          [4, 5],
          [5, 6],
          [6, 7],
          [7, 8],
          [8, 0],
        ],
      },
      aquarius: {
        points: [
          { x: -1.0, y: 0.613 },
          { x: -0.734, y: 0.163 },
          { x: -0.795, y: -0.182 },
          { x: -0.601, y: -0.584 },
          { x: -0.312, y: -0.519 },
          { x: -0.064, y: -0.613 },
          { x: 0.371, y: -0.308 },
          { x: 1.0, y: -0.053 },
        ],
        edges: [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 5],
          [5, 6],
          [6, 7],
        ],
      },
      pisces: {
        points: [
          { x: 1.0, y: 0.513 },
          { x: 0.801, y: 0.56 },
          { x: 0.704, y: 0.38 },
          { x: 0.532, y: 0.41 },
          { x: 0.479, y: 0.641 },
          { x: 0.699, y: 0.722 },
          { x: 0.227, y: 0.401 },
          { x: -0.063, y: 0.38 },
          { x: -0.274, y: 0.339 },
          { x: -0.717, y: 0.434 },
          { x: -1.0, y: 0.559 },
          { x: -0.739, y: 0.257 },
          { x: -0.591, y: -0.016 },
          { x: -0.319, y: -0.263 },
          { x: -0.42, y: -0.535 },
          { x: -0.308, y: -0.712 },
        ],
        edges: [
          [15, 14],
          [14, 13],
          [13, 12],
          [12, 11],
          [11, 10],
          [10, 9],
          [9, 8],
          [8, 7],
          [7, 6],
          [6, 3],
          [3, 4],
          [4, 5],
          [5, 1],
          [1, 2],
          [2, 3],
          [1, 0],
        ],
      },
    };

    return constellations[englishSign] || constellations['aries'];
  }

  private animate() {
    if (!this.isActive || !this.ctx) {
      cancelAnimationFrame(this.animationId);
      return;
    }

    // Clear canvas with semi-transparent black for trail effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.animationProgress += 0.01;

    // Phase 1: Stars gather to center (0-0.4)
    if (this.animationProgress < 0.4) {
      const progress = this.animationProgress / 0.4;
      this.stars.forEach((star) => {
        star.x += (star.targetX - star.x) * progress * 0.05;
        star.y += (star.targetY - star.y) * progress * 0.05;
        star.opacity = Math.min(1, star.opacity + 0.02);
        this.drawStar(star);
      });
    }

    // Phase 2: Burst and form constellation (0.4-0.7)
    else if (this.animationProgress < 0.7) {
      const progress = (this.animationProgress - 0.4) / 0.3;

      // Draw bursting stars
      this.stars.forEach((star) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = progress * 500;
        star.x = star.targetX + Math.cos(angle) * distance;
        star.y = star.targetY + Math.sin(angle) * distance;
        star.opacity = 1 - progress;
        this.drawStar(star);
      });

      // Fade in constellation
      this.constellationStars.forEach((star) => {
        star.opacity = progress;
        this.drawStar(star);
      });

      // Draw constellation lines
      if (progress > 0.5) {
        this.drawConstellationLines(progress);
      }
    }

    // Phase 3: Constellation shines (0.7-1.0)
    else {
      this.constellationStars.forEach((star) => {
        star.opacity = 0.5 + Math.sin(Date.now() * 0.001 + star.x) * 0.5;
        this.drawStar(star);
      });
      this.drawConstellationLines(1);
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private drawStar(star: Star) {
    this.ctx.save();
    this.ctx.globalAlpha = star.opacity;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = '#ffffff';

    this.ctx.beginPath();
    this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  private drawConstellationLines(opacity: number) {
    this.ctx.save();
    this.ctx.globalAlpha = opacity * 0.5;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 1;
    this.ctx.shadowBlur = 5;
    this.ctx.shadowColor = '#ffffff';

    // Rysuj krawędzie konstelacji
    this.constellationEdges.forEach(([startIndex, endIndex]) => {
      const startStar = this.constellationStars[startIndex];
      const endStar = this.constellationStars[endIndex];

      if (startStar && endStar) {
        this.ctx.beginPath();
        this.ctx.moveTo(startStar.x, startStar.y);
        this.ctx.lineTo(endStar.x, endStar.y);
        this.ctx.stroke();
      }
    });

    this.ctx.restore();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', () => this.resizeCanvas());
  }
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  targetX: number;
  targetY: number;
}
