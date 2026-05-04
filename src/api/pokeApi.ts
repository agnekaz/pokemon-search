const url = 'https://pokeapi.co/api/v2';

export const fetchPokemon = async (name: string) => {
    const response = await fetch(`${url}/pokemon/${name}`);
    if(!response.ok){
        throw new Error('Pokemon not found');
    }
    return response.json();
}