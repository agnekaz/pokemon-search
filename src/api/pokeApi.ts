import { Pokemon, PokemonListItem, PokemonListResponse } from "../types/pokemon";
const POKE_API_BASE_URL = 'https://pokeapi.co/api/v2';
export const PAGE_SIZE = 20;

async function pokeFetch<T>(endpoint: string) : Promise<T>{
    let response: Response;
    try {
      response = await fetch(endpoint);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        throw e;
      }
      if (e instanceof TypeError) {
        throw new Error('Network error: failed to reach PokeAPI.');
      }
      throw new Error('Unknown network error');
    }
    if (!response.ok) {
      const status = response.status;
      if (status === 404) {
        throw new Error('Pokemon not found');
      }
      if (status === 429) {
        throw new Error('Too many requests');
      }
      throw new Error(`Request failed (${status})`);
    }
    return response.json() as Promise<T>;
}
export const fetchPokemon = async (name: string): Promise<Pokemon> => {
    const formatedName = name.toLowerCase().trim();
    const endpoint = `${POKE_API_BASE_URL}/pokemon/${formatedName}`
    return pokeFetch<Pokemon>(endpoint);
}

export const fetchPokemonList = async( offset = 0, limit = PAGE_SIZE) : Promise<PokemonListResponse> =>{
    const endpoint = `${POKE_API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
    return pokeFetch<PokemonListResponse>(endpoint);
};

type TypeApiResponse = {
    pokemon: { pokemon: PokemonListItem }[];
};

export const fetchPokemonNamesByType = async (
    type: string
): Promise<PokemonListItem[]> => {
    const endpoint = `${POKE_API_BASE_URL}/type/${type.toLowerCase().trim()}`;
    const data = await pokeFetch<TypeApiResponse>(endpoint);
    return data.pokemon.map((entry) => entry.pokemon);
};