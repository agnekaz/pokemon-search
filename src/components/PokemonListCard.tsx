import { useState, useRef, useEffect } from "react";
import type { Pokemon } from "../types/pokemon";
import { getPokemonDetail } from "../api/pokemonDetailCache";
import PokemonCard from "./PokemonCard";

interface PokemonListCardProps {
    name: string;
}

export function PokemonListCard({ name }: PokemonListCardProps) {
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;

                setLoading(true);
                getPokemonDetail(name)
                    .then(setPokemon)
                    .catch((e) =>
                        setError(e instanceof Error ? e.message : "Failed to load")
                    )
                    .finally(() => setLoading(false));

                observer.disconnect();
            },
            { rootMargin: "100px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [name]);

    return (
        <div ref={rootRef} className="pokemon-list-card">
            {loading && <p className="pokemon-list-card__loading">Loading…</p>}
            {error && <p className="pokemon-list-card__error">{error}</p>}
            {pokemon && <PokemonCard pokemon={pokemon} />}
        </div>
    );
}
