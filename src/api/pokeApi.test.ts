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
        status: 200,
        json: async () => ({}),
    });

    await fetchPokemon("PikACHu");

    expect(global.fetch).toHaveBeenCalledWith("https://pokeapi.co/api/v2/pokemon/pikachu");
});

it("Should throw 'Pokemon not found' when response is not OK", async()=>{
    (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => "Pokemon not found",
    });

    await expect(fetchPokemon("wrong")).rejects.toThrow("Pokemon not found");
});

it("Should throw 'Too many requests' when status 429", async()=>{
    (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 429,
        json: async ()=>"Too many requests",
    });

    await expect(fetchPokemon("pikachu")).rejects.toThrow("Too many requests");
});

it("Should throw 'Network error' when fetch rejects (connection failure)", async()=>{
    (global.fetch as jest.Mock).mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(fetchPokemon("pikachu")).rejects.toThrow(/Network error|failed to reach/i);
});

it("Should return parsed JSON when response is OK", async()=>{
    const mockPokemon = { 
        id: 25,
        name: "pikachu",
        sprites: { front_default: "https://example.com/pikachu.png" },
        types: [{ type: { name: "electric" } }],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockPokemon,
    });

    await expect(fetchPokemon("pikachu")).resolves.toEqual(mockPokemon);
});
