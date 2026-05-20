import { useState, useEffect, useCallback } from 'react';
import { fetchPokemonList, PAGE_SIZE } from '../api/pokeApi';
import type { PokemonListItem } from '../types/pokemon';

type UseInfinitePokemonResult = {
    items: PokemonListItem[];
    loadMore: () => void;
    reset: () => void;
    hasMore: boolean;
    isLoading: boolean;
    isLoadingMore: boolean;
    error: string | null;
};

export function useInfinitePokemon(): UseInfinitePokemonResult{
    const [items, setItems] = useState<PokemonListItem[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadPage = useCallback( async(nextOffset: number, replace: boolean) => {
        setError(null);
        if(replace){
            setIsLoading(true);
        } else {
            setIsLoadingMore(true);
        }

        try{
            const data = await fetchPokemonList(nextOffset, PAGE_SIZE);

            setItems((prev) => replace ? data.results : [...prev, ...data.results]);
            setOffset(nextOffset + PAGE_SIZE);
            setHasMore(data.next !== null);
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Something went wrong';
            setError(message);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, []);

    useEffect(()=>{
        loadPage(0, true);
    }, [loadPage]);

    const loadMore = useCallback(() => {
        if (isLoading || isLoadingMore || !hasMore) return;
        loadPage(offset, false);
    }, [isLoading, isLoadingMore, hasMore, offset, loadPage]);

    const reset = useCallback(()=>{
        setItems([]);
        setOffset(0);
        setHasMore(true);
        setError(null);
        loadPage(0, true);
    }, [loadPage]);

    return {
        items,
        loadMore,
        reset,
        hasMore,
        isLoading,
        isLoadingMore,
        error,
    };
}