# AstroLOLogy - Zodiac Wheel Spinner

AstroLOLogy is an innovative Next.js application that features an interactive zodiac wheel spinner. The app displays zodiac signs that automatically rotate every minute, with the ability to mint each sign as an NFT sigil. This project combines cosmic aesthetics with blockchain technology to create a unique digital experience.

## 🌟 Features

- **Interactive Zodiac Wheel**: A visually appealing spinning wheel featuring all 12 zodiac signs
- **Automatic Rotation**: The wheel automatically rotates to a new zodiac sign every minute
- **Manual Spin**: Users can manually trigger the wheel to spin to a random zodiac
- **Countdown Timer**: Shows the time remaining until the next automatic rotation
- **NFT Minting**: Ability to mint zodiac signs as NFT sigils (functionality to be implemented)
- **Wallet Integration**: Built-in wallet connection using Reown AppKit and Wagmi
- **Fully Responsive**: Works seamlessly across all device sizes
- **Modern UI**: Sleek, cosmic-themed design with smooth animations

## 🛠️ Technologies Used

- **Next.js 15.5.5** (with Turbopack) - React framework
- **React 19.1.0** - Frontend library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **Reown AppKit** - Wallet connection interface
- **Wagmi** - React hooks for Ethereum
- **Viem** - Type-safe interface for Ethereum
- **@tanstack/react-query** - Server state management
- **Biome** - Linting and formatting
- **Lucide React** - Icon library

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm, yarn, pnpm, or bun package manager
- A Reown Cloud Project ID (for wallet connection)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd spinwheel
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

4. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Reown project ID:
   ```env
   NEXT_PUBLIC_PROJECT_ID=your_reown_project_id
   ```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔧 Available Scripts

- `npm run dev` - Starts the development server with Turbopack
- `npm run build` - Builds the application for production with Turbopack
- `npm run start` - Starts the production server
- `npm run lint` - Lints the code using Biome
- `npm run format` - Formats the code using Biome

## 📁 Project Structure

```
spinwheel/
├── public/
│   └── images/                 # Static assets
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── inventory/          # Inventory page (placeholder)
│   │   ├── burn/               # Burn page (placeholder)
│   │   ├── favicon.ico
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main page with zodiac wheel
│   ├── components/             # Reusable React components
│   │   └── header.tsx          # Navigation header
│   ├── config/                 # Application configuration
│   │   └── index.tsx           # Reown and Wagmi configuration
│   ├── context/                # React context providers
│   │   └── index.tsx           # Wallet connection context
│   └── lib/                    # Utility functions and data
│       └── zodiacs.ts          # Zodiac data and interface
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── biome.json                  # Biome configuration
```

## 🎡 Zodiac Wheel Mechanics

The zodiac wheel features 12 signs, each taking up 30 degrees of the 360-degree wheel. The rotation algorithm:

1. Each zodiac sign stays active for 60 seconds before the wheel spins automatically
2. When spinning, the wheel rotates through 5 full spins (1800 degrees) plus an additional rotation to land on the target sign
3. The rotation animation uses a custom easing function for smooth transitions
4. A pointer indicator at the top shows the currently selected zodiac

## 🌐 Wallet Integration

The application includes built-in wallet connection functionality:
- Uses Reown AppKit for a unified wallet connection experience
- Supports multiple wallet providers through Wagmi
- Integrates with Ethereum mainnet and Arbitrum network
- Includes cookie-based session persistence

## 📱 Responsive Design

The application is fully responsive and adapts to different screen sizes:
- Mobile-first approach with appropriate breakpoints
- Flexible zodiac wheel that maintains aspect ratio
- Adaptive navigation that converts to a hamburger menu on small screens
- Adjusted font sizes and spacing for optimal viewing across devices

## 📋 Zodiac Data

The application includes comprehensive data for all 12 zodiac signs:
- Aries (♈): 21 MAR - 19 APR
- Taurus (♉): 20 APR - 20 MAY
- Gemini (♊): 21 MAY - 20 JUN
- Cancer (♋): 21 JUN - 22 JUL
- Leo (♌): 23 JUL - 22 AUG
- Virgo (♍): 23 AUG - 22 SEP
- Libra (♎): 23 SEP - 22 OCT
- Scorpio (♏): 23 OCT - 21 NOV
- Sagittarius (♐): 22 NOV - 21 DEC
- Capricorn (♑): 22 DEC - 19 JAN
- Aquarius (♒): 20 JAN - 18 FEB
- Pisces (♓): 19 FEB - 20 MAR

## 🚧 Roadmap

- Implement actual NFT minting functionality
- Add zodiac sigil inventory management
- Introduce zodiac compatibility features
- Add dark/light mode toggle
- Implement social sharing features
- Add zodiac forecast information

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please make sure to update tests as appropriate and follow the existing code style.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or issues, please open an issue in the repository or contact the maintainers.

## ⚠️ Disclaimer

This application is for demonstration purposes. The NFT minting functionality is not fully implemented and requires additional backend development and smart contracts to work in a production environment.

---
Made with ❤️ using Next.js, TypeScript, and Tailwind CSS