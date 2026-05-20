export interface Pokemon{
    id: number;
    name: string;
    sprites: {
        front_default: string | null;
        other?: {
            'official-artwork'?: {
                front_default: string | null;
            };
        };
    };
    types: { type: {name: string } } [];
}

export interface PokemonListItem{
    name: string;
    url: string;
}

export interface PokemonListResponse{
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonListItem[];
}