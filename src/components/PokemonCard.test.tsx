import {  render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PokemonCard from './PokemonCard';

const mockPokemon = {
    id: 25,
    name: "pikachu",
    sprites: { front_default: "https://pokeapi.co" },
    types: [{ type: { name: "electric" } }],
};

it("Should render pokemon name and image correctly", ()=>{
    render(<PokemonCard pokemon={mockPokemon}/>);

    const pokemonName = screen.getByText("pikachu");
    const pokemonImage = screen.getByRole("img");

    expect(pokemonName).toBeInTheDocument();
    expect(pokemonImage).toHaveAttribute("src", mockPokemon.sprites.front_default);
    expect(pokemonImage).toHaveAttribute("alt", "pikachu");
});

it("Should not render pokemons' image if it doesn't have sprite URL", ()=>{
    const noSpritePokemon = {
        id: 132,
        name: "ditto",
        sprites: {front_default: ""},
        types: [{ type: { name: "normal" } }],
    }

    render(<PokemonCard pokemon={noSpritePokemon}/>);

    const pokemonName = screen.getByText("ditto");
    
    expect(pokemonName).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
});