import { useState, useEffect } from 'react';

export function useDebounce (value: string, delay?: number){
    const [debaouncedValue, setDebouncedValue] = useState(value);

    useEffect(()=>{
        const timer = setTimeout(()=> setDebouncedValue(value), delay||500);
        return ()=> clearTimeout(timer);
    },[value, delay])

    return debaouncedValue;
}