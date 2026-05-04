import { Pokemon } from "../types/pokemon";

interface PokemonCardProps{
    pokemon: Pokemon;
}

function PokemonCard({pokemon}: PokemonCardProps){
    const spriteUrl = pokemon.sprites?.front_default;

    return (
        <div className="pokemon-card">
            <span className="pokemon-item">{pokemon.name}</span>
            {spriteUrl ? <img src={spriteUrl} alt={pokemon.name} /> : null}
        </div>
    );
};

 export default PokemonCard;