import { useState, useEffect } from 'react';
import { Pokemon } from '../types/pokemon';
import { fetchPokemon } from '../api/pokeApi';

export const useSearchPokemon = (searchTerm: string) => {
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setPokemon(null);
            setError(null);
            return;
        }
        const loadPokemon = async () => {
            setIsLoading(true);
            setError(null);
            try{
                const result = await fetchPokemon(searchTerm);
                setPokemon(result);
            } catch (error){
                setError("Pokemon not found");
                setPokemon(null);
            } finally{
                setIsLoading(false);
            }
        };
        loadPokemon();
    }, [searchTerm]);

    return {pokemon, isLoading, error};
};