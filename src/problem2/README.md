# Currency Swap Application

A modern cryptocurrency exchange interface built with React, TypeScript, and Vite. This application provides a user-friendly interface for swapping between different cryptocurrencies with exchange rate calculations.

![Currency Swap Application](screenshots/app-screenshot.png)

![Vercel Deploy](https://deploy-badge.vercel.app/vercel/code-challenge-mu-lime?style=for-the-badge)

**[View Live Demo](https://code-challenge-mu-lime.vercel.app)**

## Features

- **Bidirectional Conversion**: Convert amounts in either direction with automatic recalculation. Exchange rates are automatically updated whenever currencies are selected.
- **Token Selection**: Dropdown selectors with token icons and symbols
- **Swap Functionality**: Quick swap button to reverse the exchange direction
- **Form Validation**: Built-in validation using Zod schemas
- **Responsive UI**: Clean, modern interface built with Tailwind CSS and Shadcn UI
- **Toast Notifications**: User feedback for successful swaps
- **Loading States**: Smooth loading indicators during data fetching

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Tailwind CSS** - Styling
- **Shadcn UI** - UI components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- bun

### Installation

1. Copy the environment file and update values:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
bun install
```

3. Start the development server:

```bash
bun run dev
```

4. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Available Scripts

- `bun run dev` - Start development server with HMR
- `bun run build` - Build for production
- `bun run preview` - Preview production build locally
- `bun run lint` - Run ESLint

## Project Structure

```
src/
├── api/
│   ├── api-hooks/          # React Query hooks
│   ├── services/           # API service functions
│   ├── apiInstance.ts      # Fetch API instance configuration
│   ├── api.constants.ts    # API constants
│   └── queryClient.ts      # TanStack Query client setup
├── components/
│   ├── ui/                 # Shadcn UI components
│   └── CurrencySwapForm.tsx # Main swap form component
├── helpers/
│   └── string.helpers.ts   # String utility functions
├── schemas/
│   └── currencySwapForm.schema.ts # Form validation schema
├── types/
│   └── token.types.ts      # TypeScript type definitions
├── App.tsx                 # Root component
├── index.css               # Main app CSS
└── main.tsx                # Application entry point
```

## How It Works

1. **Token Price Fetching**: The application fetches token prices from the configured API endpoint using TanStack Query
2. **Exchange Rate Calculation**: When a user enters an amount, the app calculates the equivalent amount in the target currency based on current prices
3. **Real-time Updates**: The form automatically recalculates amounts when the user changes currencies or amounts
4. **Form Submission**: On swap confirmation, the form validates the data and simulates a swap transaction

## React Compiler

This project has the React Compiler enabled. See the [React Compiler documentation](https://react.dev/learn/react-compiler) for more information.

Note: This may impact Vite dev & build performance.

## ESLint Configuration

The project uses ESLint with TypeScript support. For production applications, consider enabling type-aware lint rules as described in the [ESLint documentation](https://typescript-eslint.io/getting-started).

## License

This project is part of the 99tech code challenge.
