export const fetchPokemon = jest.fn(() =>
    Promise.resolve({
      id: 0,
      name: '',
      sprites: { front_default: '' },
      types: [],
    })
  );