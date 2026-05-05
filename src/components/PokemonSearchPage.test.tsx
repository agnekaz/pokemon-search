import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import PokemonSearchPage from './PokemonSearchPage';
import { useSearchPokemon } from '../hooks/useSearchPokemon';

jest.mock('../api/pokeApi');
jest.mock('../hooks/useSearchPokemon');
const mockedUseSearchPokemon = useSearchPokemon as jest.MockedFunction<typeof useSearchPokemon>;
beforeEach(() =>{
    jest.useFakeTimers();
    mockedUseSearchPokemon.mockReset();
    mockedUseSearchPokemon.mockReturnValue({
        pokemon: null,
        isLoading: false,
        error: null,
    });
});

afterEach(()=>{
    jest.useRealTimers();
});

it("Should render Input", async ()=>{
    render(<PokemonSearchPage/>);

    const textbox = screen.getByRole("textbox");

    expect(textbox).toBeInTheDocument();
});

it("Should show loading text", async()=>{
    mockedUseSearchPokemon.mockReturnValue({
        pokemon: null,
        isLoading: true,
        error: null,
    });

    render(<PokemonSearchPage />);
    const input = screen.getByRole("textbox");
    userEvent.type(input, "pikachu");
    act(() => {
        jest.advanceTimersByTime(500);
    });

    expect(screen.getByText(/Searching for pokemon.../i)).toBeInTheDocument();
});

it("Should show error message", ()=>{
    mockedUseSearchPokemon.mockReturnValue({
        pokemon: null,
        isLoading: false,
        error: "Pokemon not found",
    })
    render(<PokemonSearchPage/>);
    expect(screen.getByText(/Pokemon not found/i)).toBeInTheDocument();
});

it("Should only trigger search after user stops typing", () => {
    mockedUseSearchPokemon.mockReturnValue({
        pokemon: null,
        isLoading: false,
        error: null,
    });

    render(<PokemonSearchPage/>);
    const input = screen.getByRole("textbox");

    userEvent.type(input, "pik");
    expect(mockedUseSearchPokemon).not.toHaveBeenLastCalledWith("pik");
    act(()=>{
        jest.advanceTimersByTime(500);
    });
    expect(mockedUseSearchPokemon).toHaveBeenLastCalledWith("pik");
});

it("Pokemon card and error should not be visible when loading", ()=>{
    mockedUseSearchPokemon.mockReturnValue({
        pokemon: {
            id: 25,
            name: "pikachu",
            sprites: { front_default: "https://pokeapi.co" },
            types: [{ type: { name: "electric" } }],
        },
        isLoading: true,
        error: "Old error",
    });

    render(<PokemonSearchPage/>);

    expect(screen.getByText(/Searching for pokemon.../i)).toBeInTheDocument();
    expect(screen.queryByText(/pikachu/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Old error/i)).not.toBeInTheDocument();
});

it("Should render pokemon card with name and image", ()=>{
    mockedUseSearchPokemon.mockReturnValue({
        pokemon: {
            id: 25,
            name: "pikachu",
            sprites: { front_default: "https://pokeapi.co" },
            types: [{ type: { name: "electric" } }],
        },
        isLoading: false,
        error: null,
    });
    
    render(<PokemonSearchPage/>);

    const image = screen.getByRole("img", {name:/pikachu/i});

    expect(image).toHaveAttribute("src",  "https://pokeapi.co");
    expect(image).toHaveAttribute("alt", "pikachu");
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
});