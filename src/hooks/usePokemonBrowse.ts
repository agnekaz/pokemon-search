import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { fetchPokemonNamesByType, PAGE_SIZE } from '../api/pokeApi';
import { useInfinitePokemon } from './useInfinitePokemon';
import type { PokemonListItem } from '../types/pokemon';

function filterByName(items: PokemonListItem[], query: string): PokemonListItem[] {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.name.includes(q));
}

export function usePokemonBrowse(typeFilter: string, debouncedName: string) {
    const {
        items,
        loadMore: loadMoreFromApi,
        reset,
        hasMore: hasMoreFromApi,
        isLoading: isLoadingFromApi,
        isLoadingMore: isLoadingMoreFromApi,
        error: errorFromApi,
    } = useInfinitePokemon();
    const [typeItems, setTypeItems] = useState<PokemonListItem[]>([]);
    const [typePage, setTypePage] = useState(0);
    const [typeLoading, setTypeLoading] = useState(false);
    const [typeError, setTypeError] = useState<string | null>(null);
    const prevTypeRef = useRef(typeFilter);

    useEffect(() => {
        if (typeFilter === 'all') {
            if (prevTypeRef.current !== 'all') {
                reset();
            }
            prevTypeRef.current = typeFilter;
            return;
        }

        prevTypeRef.current = typeFilter;
        let cancelled = false;

        setTypeLoading(true);
        setTypeError(null);
        setTypePage(0);

        fetchPokemonNamesByType(typeFilter)
            .then((data) => {
                if (!cancelled) setTypeItems(data);
            })
            .catch((e) => {
                if (!cancelled) {
                    setTypeError(
                        e instanceof Error ? e.message : 'Something went wrong'
                    );
                    setTypeItems([]);
                }
            })
            .finally(() => {
                if (!cancelled) setTypeLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [typeFilter, reset]);

    const filteredAllItems = useMemo(
        () => filterByName(items, debouncedName),
        [items, debouncedName]
    );

    const filteredTypeItems = useMemo(
        () => filterByName(typeItems, debouncedName),
        [typeItems, debouncedName]
    );

    const visibleItems = useMemo(() => {
        if (typeFilter === 'all') return filteredAllItems;
        return filteredTypeItems.slice(0, (typePage + 1) * PAGE_SIZE);
    }, [typeFilter, filteredAllItems, filteredTypeItems, typePage]);

    const loadMore = useCallback(() => {
        if (typeFilter === 'all') {
            loadMoreFromApi();
            return;
        }
        setTypePage((page) => page + 1);
    }, [typeFilter, loadMoreFromApi]);

    const hasMore =
        typeFilter === 'all'
            ? hasMoreFromApi
            : (typePage + 1) * PAGE_SIZE < filteredTypeItems.length;

    const isLoading = typeFilter === 'all' ? isLoadingFromApi : typeLoading;
    const isLoadingMore = typeFilter === 'all' ? isLoadingMoreFromApi : false;
    const error = typeFilter === 'all' ? errorFromApi : typeError;

    const showEmptyHint =
        !isLoading &&
        !error &&
        visibleItems.length === 0 &&
        debouncedName.trim().length > 0;

    return {
        visibleItems,
        loadMore,
        hasMore,
        isLoading,
        isLoadingMore,
        error,
        showEmptyHint,
    };
}
