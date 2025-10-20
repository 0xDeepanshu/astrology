# QWEN.md - AstroLOLogy Spin Wheel Project

## Project Overview

This is a Next.js 15 application called "AstroLOLogy" - a zodiac wheel spinner that displays zodiac signs and allows users to mint them as NFT sigils. The project features a spinning wheel that automatically rotates to a new zodiac sign every minute, with a visual interface showing the current zodiac and a countdown timer.

### Key Technologies
- Next.js 15.5.5 (with Turbopack)
- React 19.1.0
- TypeScript
- Tailwind CSS
- Biome (for linting and formatting)

### Architecture
- App Router structure (Next.js 13+)
- Client-side rendering with React hooks
- Static assets in `public/images/`
- Utility functions in `src/lib/`
- Reusable components in `src/components/`

## Project Structure
```
D:\Nextjs\spinwheel\
├── src/
│   ├── app/
│   │   └── page.tsx (main page with zodiac wheel)
│   ├── components/
│   │   └── wheel.tsx (wheel component)
│   └── lib/
│       └── zodiacs.ts (zodiac data and interface)
├── public/
│   └── images/ (wheel images)
├── package.json (dependencies and scripts)
└── next.config.ts, tsconfig.json, biome.json
```

## Key Features

### Main Page (src/app/page.tsx)
- Displays a spinning zodiac wheel with 12 zodiac signs
- Automatic rotation every 60 seconds
- Manual spin functionality
- Current zodiac display with symbol and date range
- Countdown timer showing time until next rotation
- Mint button for zodiac sigils (currently shows alert)

### Zodiac Data (src/lib/zodiacs.ts)
- Interface defining Zodiac type with name, symbol, dateRange, and index
- Array of 12 zodiac signs with symbols and date ranges
- Index corresponds to position on the wheel (0-11)

### Wheel Component (src/components/wheel.tsx)
- Displays the zodiac wheel image
- Uses Next.js Image component for optimized loading

## Building and Running

### Development Commands
```bash
# Run development server with Turbopack
bun dev
# or with npm
npm run dev
```

### Other Commands
```bash
# Build for production
npm run build

# Start production server
npm run start

# Lint code with Biome
npm run lint

# Format code with Biome
npm run format
```

The application runs on http://localhost:3000 by default.

## Development Conventions

- TypeScript is used throughout the project
- Tailwind CSS for styling
- Client-side state management with React hooks (useState, useEffect)
- Next.js Image component for optimized image loading
- Biome for code formatting and linting
- Absolute imports using @/ alias (e.g., '@/lib/zodiacs')

## Project-Specific Information

- Each zodiac segment on the wheel represents 30 degrees (360/12)
- The wheel rotates smoothly with a 1.5 second animation
- The timer countdown resets to 60 seconds after each rotation
- The arrow pointer is fixed at the top center to indicate the selected zodiac
- The "Mint" functionality currently shows an alert but would need to be implemented for actual NFT minting

## File Locations

- Main application logic: `src/app/page.tsx`
- Zodiac data: `src/lib/zodiacs.ts`
- Visual components: `src/components/`
- Images: `public/images/`
- Configuration: root directory files