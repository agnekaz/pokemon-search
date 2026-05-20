export const POKEMON_TYPES = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
] as const;

const TYPE_COLORS: Record<string, string> = {
    normal: '#A8A878',
    fire: '#FB6C6C',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#48D0B0',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
};

const DEFAULT_COLOR = '#778899';

export function getPrimaryTypeColor(types: string[]): string {
    const primary = types[0]?.toLowerCase();
    return (primary && TYPE_COLORS[primary]) || DEFAULT_COLOR;
}
