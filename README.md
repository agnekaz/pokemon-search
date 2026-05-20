# Pokémon Search

A React + TypeScript app for browsing and filtering Pokémon from the public [PokeAPI](https://pokeapi.co/). Search by **name**, filter by **type**, look up a Pokémon by **numeric ID**, and scroll to load more results. Card details (sprites, types, colors) load lazily as cards enter the viewport.

**Live app:** [https://pokemon-search-mu-peach.vercel.app/](https://pokemon-search-mu-peach.vercel.app/)

## Features

- **Infinite scroll** — paginated list of Pokémon (`limit=20`) with automatic loading near the bottom of the page
- **Lazy-loaded card details** — list items fetch full Pokémon data only when visible (`IntersectionObserver` + in-memory cache)
- **Name filter** — debounced client-side filter on loaded names (`includes`)
- **Type filter** — browse all Pokémon or load names for a selected type (e.g. Fire, Water)
- **ID search** — typing only digits (e.g. `25`) fetches that Pokémon directly via the API
- **Type-colored cards** — card background follows the Pokémon’s primary type
- **Responsive layout** — single-column grid on mobile, multi-column on larger screens
- **Custom headline** — “Pokemon Search” title using the Pokémon Solid font

## Tech stack

- **React 19** and **TypeScript** ([Create React App](https://create-react-app.dev/) / `react-scripts` 5)
- **Sass (SCSS)** for styling
- **Jest** and **React Testing Library** for unit and component tests

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Dev server with hot reload |
| `npm test` | Tests in interactive watch mode (CRA default) |
| `npm test -- --watchAll=false` | Run all tests once (useful for CI) |
| `npm run build` | Production build into `build/` |
| `npm run eject` | Eject from CRA (irreversible; rarely needed) |

## How it works (high level)

1. **Browse mode** — `useInfinitePokemon` loads pages of `{ name, url }` from `GET /pokemon?limit=&offset=`.
2. **Lazy details** — each `PokemonListCard` calls `getPokemonDetail(name)` when it enters the viewport; results are cached in `pokemonDetailCache.ts`.
3. **Filters** — `usePokemonBrowse` applies the name filter to the loaded list and switches between the global list and type-specific lists from `GET /type/{type}`.
4. **ID search** — when the debounced input is numeric, `useSearchPokemon` calls `GET /pokemon/{id}` and shows a single card instead of the grid.

## Project structure

| Path | Role |
| --- | --- |
| `src/components/PokemonSearchPage.tsx` | Main page: filters, grid, ID search, infinite scroll |
| `src/components/PokemonCard.tsx` | Pokémon card UI (name, types, artwork) |
| `src/components/PokemonListCard.tsx` | Lazy-load wrapper around `PokemonCard` |
| `src/components/TypeFilter.tsx` | Type dropdown |
| `src/components/input.tsx` | Search / filter input |
| `src/hooks/useInfinitePokemon.ts` | Paginated list state |
| `src/hooks/useInfiniteScroll.ts` | Scroll sentinel (`IntersectionObserver`) |
| `src/hooks/usePokemonBrowse.ts` | Name + type filtering and browse state |
| `src/hooks/useSearchPokemon.ts` | Direct lookup by name or ID |
| `src/hooks/useDebounce.ts` | Debounced input (default 500 ms) |
| `src/api/pokeApi.ts` | PokeAPI client (`fetchPokemon`, `fetchPokemonList`, `fetchPokemonNamesByType`) |
| `src/api/pokemonDetailCache.ts` | Detail cache and in-flight deduplication |
| `src/utils/pokemonTypeColors.ts` | Type → color mapping for cards |
| `src/types/pokemon.ts` | `Pokemon`, list response types |
| `src/assets/fonts/PokemonSolid.ttf` | Custom headline font |
| `src/App.scss` | Global and component styles |

Tests live next to source files (e.g. `pokeApi.test.ts`, `PokemonSearchPage.test.tsx`).

## Styling

- Global styles are in `src/App.scss` (imported from `App.tsx` and components).
- SCSS module types are declared in `src/react-app-env.d.ts`.
- Fonts bundled from `src/assets/fonts/` (required for Create React App to resolve `@font-face` URLs).

## Data source

Pokémon data is provided by [PokeAPI](https://pokeapi.co/). This project is a learning demo and is not affiliated with Nintendo, Game Freak, or The Pokémon Company.
