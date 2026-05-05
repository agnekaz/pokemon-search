import { fetchPokemon } from './pokeApi';

beforeEach(() => {
    global.fetch = jest.fn();
})

afterEach(() => {
    jest.resetAllMocks();
})

it("Should call pokeApi with lowercased name", async()=>{
    (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
    });

    await fetchPokemon("PikACHu");

    expect(global.fetch).toHaveBeenCalledWith("https://pokeapi.co/api/v2/pokemon/pikachu");
});

it("Should throw 'Pokemon not found' when response is not OK", async()=>{
    (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({}),
    });

    await expect(fetchPokemon("wrong")).rejects.toThrow("Pokemon not found");
});

it("Should return parsed JSON when response is OK", async()=>{
    const mockPokemon = { name: "pikachu", id: 25 };
    (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockPokemon,
    });

    await expect(fetchPokemon("pikachu")).resolves.toEqual(mockPokemon);
});