import type { Pokemon } from "../types/pokemon";
import { fetchPokemon } from "./pokeApi";

const cache = new Map<string, Pokemon>();
const inflight = new Map<string, Promise<Pokemon>>();

export function getPokemonDetail(name: string): Promise<Pokemon>{
    const key = name.toLocaleLowerCase();

    const hit = cache.get(key);
    if(hit) return Promise.resolve(hit);

    const pending = inflight.get(key);
    if(pending) return pending;

    const request = fetchPokemon(key)
    .then((pokemon) => {
        cache.set(key, pokemon);
        inflight.delete(key);
        return pokemon;
    })
    .catch((err) => {
        inflight.delete(key);
        throw err;
    });

    inflight.set(key, request);
    return request;
}