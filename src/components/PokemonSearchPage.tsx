import React, { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { usePokemonBrowse } from '../hooks/usePokemonBrowse';
import { useSearchPokemon } from '../hooks/useSearchPokemon';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import '../App.scss';
import Input from './input';
import TypeFilter from './TypeFilter';
import PokemonCard from './PokemonCard';
import { PokemonListCard } from './PokemonListCard';

function isIdSearch(query: string): boolean {
    return /^\d+$/.test(query.trim());
}

function PokemonSearchPage() {
    const [nameFilter, setNameFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameFilter(e.target.value);
    };

    const debouncedName = useDebounce(nameFilter);
    const idQuery = isIdSearch(debouncedName) ? debouncedName.trim() : '';
    const browseQuery = idQuery ? '' : debouncedName;

    const {
        visibleItems,
        loadMore,
        hasMore,
        isLoading,
        isLoadingMore,
        error,
        showEmptyHint,
    } = usePokemonBrowse(typeFilter, browseQuery);

    const {
        pokemon: idPokemon,
        isLoading: idLoading,
        error: idError,
    } = useSearchPokemon(idQuery);

    const sentinelRef = useInfiniteScroll(
        loadMore,
        !idQuery && hasMore && !isLoadingMore
    );

    return (
        <main className="pokemon-search-page">
            <h1 className="pokemon-search-page__title">Pokemon Search</h1>
            <Input value={nameFilter} onChange={onChange} />
            <TypeFilter value={typeFilter} onChange={setTypeFilter} />

            {idQuery ? (
                <>
                    {idLoading && (
                        <p className="pokemon-search-page__status">Searching for pokemon…</p>
                    )}
                    {idError && !idLoading && (
                        <p className="pokemon-search-page__error">{idError}</p>
                    )}
                    {idPokemon && !idLoading && <PokemonCard pokemon={idPokemon} />}
                </>
            ) : (
                <>
                    {isLoading && (
                        <p className="pokemon-search-page__status">Loading Pokémon…</p>
                    )}
                    {error && <p className="pokemon-search-page__error">{error}</p>}
                    {showEmptyHint && (
                        <p className="pokemon-search-page__hint">
                            No Pokémon match your filters. Try another name or scroll to load more.
                        </p>
                    )}

                    <div className="pokemon-grid">
                        {visibleItems.map((item) => (
                            <PokemonListCard
                                key={`${typeFilter}-${item.name}`}
                                name={item.name}
                            />
                        ))}
                    </div>

                    <div ref={sentinelRef} className="pokemon-scroll-sentinel" aria-hidden />
                    {isLoadingMore && (
                        <p className="pokemon-search-page__status">Loading more…</p>
                    )}
                </>
            )}
        </main>
    );
}

export default PokemonSearchPage;
