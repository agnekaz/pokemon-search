import { POKEMON_TYPES } from '../utils/pokemonTypeColors';
import '../App.scss';

interface TypeFilterProps {
    value: string;
    onChange: (type: string) => void;
}

function formatTypeLabel(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
}

function TypeFilter({ value, onChange }: TypeFilterProps) {
    return (
        <div className="type-filter">
            <label htmlFor="pokemon-type-filter" className="type-filter__label">
                Type
            </label>
            <select
                id="pokemon-type-filter"
                className="type-filter__select"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="all">All types</option>
                {POKEMON_TYPES.map((type) => (
                    <option key={type} value={type}>
                        {formatTypeLabel(type)}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default TypeFilter;
