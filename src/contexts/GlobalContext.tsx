import { Unit } from 'openweathermap-ts/dist/types';
import { SetStateAction, createContext } from 'react';

export type TGlobalContext = {
    unit: Unit,
    setUnit: React.Dispatch<SetStateAction<Unit>>
}
export const GlobalContext = createContext<TGlobalContext | null>(null);