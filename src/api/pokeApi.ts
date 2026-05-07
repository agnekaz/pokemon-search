import {Pokemon} from "../types/pokemon";
const POKE_API_BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchPokemon = async (name: string): Promise<Pokemon> => {
    const formatedName = name.toLowerCase().trim();
    const endPoint = `${POKE_API_BASE_URL}/pokemon/${formatedName}`

    let response: Response;
    try{
        response = await fetch(endPoint);
    } catch (e) {
        if(e instanceof DOMException && e.name ==="AbortError"){
            throw e;
        }
        
        if(e instanceof TypeError){
            throw new Error("Network error: failed to reach PokeAPI.");
        }

        throw new Error("Unknown network error");
    }
     
    if(!response.ok){
        const status = response.status;
        if(status === 404){
            throw new Error('Pokemon not found');
        }
        if(status === 429){
            throw new Error("Too many requests");
        }
        throw new Error(`Request failed (${status})`);
    }
    const data: Pokemon = await response.json();
    return data;
}