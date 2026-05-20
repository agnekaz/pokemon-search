import { Pokemon } from "../types/pokemon";
import { getPrimaryTypeColor } from "../utils/pokemonTypeColors";
import '../App.scss';

interface PokemonCardProps{
    pokemon: Pokemon;
}

function formatName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function getPokemonImageUrl(pokemon: Pokemon): string | null {
    const artwork = pokemon.sprites.other?.['official-artwork']?.front_default;
    return artwork || pokemon.sprites.front_default || null;
}

function PokemonCard({pokemon}: PokemonCardProps){
    const spriteUrl = getPokemonImageUrl(pokemon);
    const types = pokemon.types?.map((t) => t.type.name) ?? [];
    const backgroundColor = getPrimaryTypeColor(types);

    return (
        <article
            className="pokemon-card"
            style={{ backgroundColor }}
            aria-label={`${formatName(pokemon.name)} card`}
        >
            <div className="pokemon-card__content">
                <h2 className="pokemon-card__name">{formatName(pokemon.name)}</h2>
                <div className="pokemon-card__types" aria-label="pokemon types">
                    {types.map((type) => (
                        <span key={type} className="pokemon-card__type">
                            {formatName(type)}
                        </span>
                    ))}
                </div>
            </div>
            {spriteUrl ? (
                <div className="pokemon-card__media">
                    <img
                        className="pokemon-card__image"
                        src={spriteUrl}
                        alt={pokemon.name}
                    />
                </div>
            ) : null}
        </article>
    );
}

export default PokemonCard;
