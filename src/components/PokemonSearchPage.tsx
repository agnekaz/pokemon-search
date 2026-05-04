import React from 'react';
import { useState } from 'react';
import '../App.css';
import { useDebounce } from '../hooks/useDebounce';
import { useSearchPokemon } from '../hooks/useSearchPokemon';
import Input from './input';
import PokemonCard from './PokemonCard';

function PokemonSearchPage() {
    const [ term, setTerm ] = useState('');
    
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setTerm(e.target.value);
    }
    
    const debouncedValue = useDebounce(term);

    const {pokemon, isLoading, error} = useSearchPokemon(debouncedValue);

    return (
        <>
        <Input value={term} onChange={onChange}/>
        {isLoading && <p>Searching for pokemon...</p>}
        {error && !isLoading && <p>{error}</p>}
        {pokemon && !isLoading && <PokemonCard pokemon={pokemon}/>}
        </>
    );
}

export default PokemonSearchPage;