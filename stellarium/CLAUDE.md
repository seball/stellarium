# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Stellarium is a Daily Horoscope Application built with Angular 20. It provides AI-generated horoscopes using OpenAI models through GitHub's AI service, featuring a cosmic-themed UI with animated starfield backgrounds and glassmorphism effects.

## Development Commands

### Essential Commands
- `npm start` - Start development server on http://localhost:4200/
- `npm run build` - Build for production
- `npm test` - Run unit tests with Karma and Jasmine
- `npm run watch` - Build in watch mode for development

### Testing
- Run all tests: `ng test`
- Run tests with coverage: `ng test --code-coverage`
- Run tests once (CI mode): `ng test --watch=false --browsers=ChromeHeadless`

## Architecture Overview

### Component Structure
The application uses Angular's modern standalone components architecture:

```
src/app/
├── app.component.ts         # Root component with starfield animation
├── app.config.ts           # Application configuration
├── horoscope/              # Horoscope display component
│   ├── horoscope.component.ts
│   ├── horoscope.component.html
│   ├── horoscope.component.scss
│   └── horoscope.component.spec.ts
└── zodiac-selector/        # Zodiac sign selection component
    ├── zodiac-selector.component.ts
    ├── zodiac-selector.component.html
    ├── zodiac-selector.component.scss
    └── zodiac-selector.component.spec.ts
```

### Key Technical Details
- **State Management**: Component-level state with Angular signals
- **AI Service**: OpenAI service using GitHub Models API (GPT-4) for horoscope generation
- **Daily Limit**: Implemented using localStorage to track last generation timestamp
- **Styling**: SCSS with component-scoped styles, element-based color coding for zodiac signs
- **Testing**: Karma + Jasmine for unit tests, test files co-located with components

### Code Standards
- TypeScript strict mode enabled with additional Angular compiler checks
- 2-space indentation (enforced by .editorconfig)
- Single quotes for TypeScript imports
- Component files follow Angular naming convention: `component-name.component.{ts,html,scss,spec.ts}`

### Important Implementation Notes
- The app prevents multiple horoscope generations per day using localStorage
- Each zodiac sign has an associated element (Fire, Earth, Air, Water) that determines its color scheme
- The starfield animation is implemented using canvas in the app component
- All components are standalone (no NgModules) following Angular's modern approach
- **GitHub Token Required**: Set up GitHub PAT token in `src/environments/environment.ts` for AI functionality (see GITHUB_TOKEN_SETUP.md)
- **AI Service**: Located at `src/app/services/openai.service.ts` - handles all OpenAI API interactions
- **Fortune Tellers**: 6 different fortune tellers with unique personalities and styles (sarcastic, mystic, cheerful, dramatic, wise, modern)
- **User Selections**: Both zodiac sign and fortune teller are saved permanently after first selection
- **Markdown Support**: Horoscope text supports markdown formatting (bold, headers, etc.) via `marked` library