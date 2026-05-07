import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { useSearchPokemon } from '../hooks/useSearchPokemon';
import { fetchPokemon } from '../api/pokeApi';

jest.mock('../api/pokeApi');
const mockedFetchPokemon = fetchPokemon as jest.MockedFunction<typeof fetchPokemon>;
beforeEach(() => {
    jest.clearAllMocks();
});

it("Should return null initially if searchTerm is empty", async()=>{
    const { result } = renderHook(() => useSearchPokemon(''));

    expect(result.current.pokemon).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
});

it("Should fetch pokemon correctly", async ()=>{
    const mockPokemon = {
        id: 25,
        name: "pikachu",
        sprites: { front_default: "https://example.com/pikachu.png" },
        types: [{ type: { name: "electric" } }],
    };
    mockedFetchPokemon.mockResolvedValueOnce(mockPokemon);

    const { result } = renderHook(() => useSearchPokemon("pikachu"));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
        expect(result.current.pokemon).toEqual(mockPokemon);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
    })
});

it("Should handle error if pokemon is not found", async () => {
    mockedFetchPokemon.mockRejectedValue(new Error("Pokemon not found"));

    const { result } = renderHook(() => useSearchPokemon("abcd"));

    await waitFor(() => {
        expect(result.current.error).toBe("Pokemon not found");
       
    })
    expect(result.current.isLoading).toBe(false);
    expect(result.current.pokemon).toBeNull();
})