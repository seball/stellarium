# Stellarium - Daily Horoscope Application

A modern Angular application that provides personalized daily horoscopes using Puter AI. The app features a beautiful cosmic-themed UI with animated stars and a one-horoscope-per-day limit per visitor.

## Features

- **Personalized Horoscopes**: Get AI-generated horoscopes tailored to your zodiac sign
- **Daily Limit**: One horoscope per day per visitor (tracked via localStorage)
- **Beautiful UI**: Cosmic-themed design with animated starfield background
- **Zodiac Selection**: Interactive grid of all 12 zodiac signs with element-based color coding
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern Angular**: Built with the latest Angular version using standalone components

## Technologies Used

- Angular 18+ (latest)
- TypeScript
- SCSS with advanced animations
- Puter AI API for horoscope generation
- LocalStorage for daily limit tracking

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:4200`

## How It Works

1. Users select their zodiac sign from the interactive grid
2. The app checks if they've already received a horoscope today
3. If not, it generates a personalized horoscope using Puter AI
4. The horoscope is saved to localStorage with today's date
5. Users can only receive one horoscope per day

## Component Structure

- **App Component**: Main container with gradient background
- **Horoscope Component**: Manages the horoscope flow and state
- **Zodiac Selector Component**: Interactive zodiac sign selection grid

## Styling Features

- Animated starfield background with three layers of stars
- Glassmorphism effects on cards
- Element-based color coding (Fire, Earth, Air, Water)
- Smooth transitions and hover effects
- Responsive typography using Playfair Display and Inter fonts