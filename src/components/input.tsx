import React from 'react';
import '../App.scss';

interface InputProps{
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
function Input({value, onChange}:InputProps){
  return(
    <>
    <div className="input-group">
        <label htmlFor="pokemon-input" className="input-group__label"></label>
        <input 
        type="text" 
        className="input-group__input" 
        id="pokemon-input"
        placeholder='Filter by name or search by id…'
        value={value}
        onChange={onChange}
        ></input>
    </div>
    </>
  );
}

export default Input;
