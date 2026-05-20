import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import PokemonSearchPage from './PokemonSearchPage';
import { usePokemonBrowse } from '../hooks/usePokemonBrowse';
import { useSearchPokemon } from '../hooks/useSearchPokemon';

jest.mock('../api/pokeApi');
jest.mock('../hooks/usePokemonBrowse');
jest.mock('../hooks/useSearchPokemon');
jest.mock('../hooks/useInfiniteScroll', () => ({
    useInfiniteScroll: () => ({ current: null }),
}));
jest.mock('./PokemonListCard', () => ({
    PokemonListCard: ({ name }: { name: string }) => <div data-testid="list-card">{name}</div>,
}));

const mockedUsePokemonBrowse = usePokemonBrowse as jest.MockedFunction<typeof usePokemonBrowse>;
const mockedUseSearchPokemon = useSearchPokemon as jest.MockedFunction<typeof useSearchPokemon>;

const defaultBrowse = {
    visibleItems: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
    loadMore: jest.fn(),
    hasMore: true,
    isLoading: false,
    isLoadingMore: false,
    error: null,
    showEmptyHint: false,
};

beforeEach(() => {
    jest.useFakeTimers();
    mockedUsePokemonBrowse.mockReset();
    mockedUsePokemonBrowse.mockReturnValue(defaultBrowse);
    mockedUseSearchPokemon.mockReset();
    mockedUseSearchPokemon.mockReturnValue({
        pokemon: null,
        isLoading: false,
        error: null,
    });
});

afterEach(() => {
    jest.useRealTimers();
});

it('renders headline, name input and type filter', () => {
    render(<PokemonSearchPage />);

    expect(screen.getByRole('heading', { name: /pokemon search/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /type/i })).toBeInTheDocument();
});

it('shows loading status', () => {
    mockedUsePokemonBrowse.mockReturnValue({
        ...defaultBrowse,
        isLoading: true,
        visibleItems: [],
    });

    render(<PokemonSearchPage />);

    expect(screen.getByText(/Loading Pokémon/i)).toBeInTheDocument();
});

it('shows error message', () => {
    mockedUsePokemonBrowse.mockReturnValue({
        ...defaultBrowse,
        error: 'Too many requests',
        visibleItems: [],
    });

    render(<PokemonSearchPage />);

    expect(screen.getByText(/Too many requests/i)).toBeInTheDocument();
});

it('renders visible pokemon list cards', () => {
    render(<PokemonSearchPage />);

    expect(screen.getByTestId('list-card')).toHaveTextContent('bulbasaur');
});

it('passes debounced name filter to browse hook', () => {
    render(<PokemonSearchPage />);

    userEvent.type(screen.getByRole('textbox'), 'bulb');
    expect(mockedUsePokemonBrowse).toHaveBeenLastCalledWith('all', '');

    act(() => {
        jest.advanceTimersByTime(500);
    });

    expect(mockedUsePokemonBrowse).toHaveBeenLastCalledWith('all', 'bulb');
});

it('passes selected type to browse hook', () => {
    render(<PokemonSearchPage />);

    userEvent.selectOptions(screen.getByRole('combobox', { name: /type/i }), 'fire');

    expect(mockedUsePokemonBrowse).toHaveBeenLastCalledWith('fire', '');
});

it('shows empty hint when no matches', () => {
    mockedUsePokemonBrowse.mockReturnValue({
        ...defaultBrowse,
        visibleItems: [],
        showEmptyHint: true,
    });

    render(<PokemonSearchPage />);

    expect(screen.getByText(/No Pokémon match your filters/i)).toBeInTheDocument();
});

it('searches by id via useSearchPokemon when input is numeric', () => {
    render(<PokemonSearchPage />);

    userEvent.type(screen.getByRole('textbox'), '25');
    act(() => {
        jest.advanceTimersByTime(500);
    });

    expect(mockedUseSearchPokemon).toHaveBeenLastCalledWith('25');
    expect(mockedUsePokemonBrowse).toHaveBeenLastCalledWith('all', '');
});

it('shows pokemon card when id search succeeds', () => {
    mockedUseSearchPokemon.mockReturnValue({
        pokemon: {
            id: 25,
            name: 'pikachu',
            sprites: { front_default: 'https://example.com/pikachu.png' },
            types: [{ type: { name: 'electric' } }],
        },
        isLoading: false,
        error: null,
    });

    render(<PokemonSearchPage />);
    userEvent.type(screen.getByRole('textbox'), '25');
    act(() => {
        jest.advanceTimersByTime(500);
    });

    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    expect(screen.queryByTestId('list-card')).not.toBeInTheDocument();
});

it('shows loading more status', () => {
    mockedUsePokemonBrowse.mockReturnValue({
        ...defaultBrowse,
        isLoadingMore: true,
    });

    render(<PokemonSearchPage />);

    expect(screen.getByText(/Loading more/i)).toBeInTheDocument();
});
