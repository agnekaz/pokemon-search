## Pokémon Search

Small React + TypeScript app to search Pokémon by **name or ID** using the [PokeAPI](https://pokeapi.co/). The UI includes a search input, debounced requests, and a simple Pokémon card (sprite + types).

## Tech stack

- **React + TypeScript** (Create React App)
- **Sass (SCSS)** for styling
- **React Testing Library + Jest** for tests

## Getting started

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm start
```

Open `http://localhost:3000`.

## Scripts

- **`npm start`**: run locally in dev mode
- **`npm test`**: run tests (watch mode by default)
- **`npm test -- --watchAll=false`**: run all tests once (CI-style)
- **`npm run build`**: production build

## Styling (SCSS)

- Global styles live in `src/App.scss` and are imported in `src/App.tsx`.
- TypeScript needs SCSS module declarations. This project includes them in `src/react-app-env.d.ts` (`declare module '*.scss'`).

## Project structure (high level)

- `src/components/`: UI components (`Input`, `PokemonCard`, `PokemonSearchPage`)
- `src/hooks/`: reusable hooks (e.g. `useDebounce`, `useSearchPokemon`)
- `src/api/`: PokeAPI client + mocks for tests
- `src/types/`: TypeScript types (e.g. `Pokemon`)

## Notes

- Data source: [PokeAPI](https://pokeapi.co/)
- If you run into stylesheet import type errors, ensure `sass` is installed and `src/react-app-env.d.ts` declares `*.scss`.
