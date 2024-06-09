import { CurrentResponse, Unit } from 'openweathermap-ts/dist/types';
import { TPosition } from '@utilities/common';
import { 
    createContext,
    useState,
    useEffect,
    SetStateAction
} from 'react';
import { TIconData } from '@components/atoms/WeatherIcon';

export type TGlobalContextPosition = TPosition | null;

export type TGlobalContext = {
    unit: Unit,
    position: TGlobalContextPosition
    currentWeather: TIconData | null,
    setCurrentWeather: React.Dispatch<SetStateAction<TIconData | null>>
}


export const GlobalContext = createContext<TGlobalContext | null>(null);

export type TGlobalContextProvider = {
    children: React.ReactNode;
    unit: Unit,
    position: TPosition
}

/**
 * Provide Context for App which contains position and unit data
 * @param {ReactNode} children
 * 
 * @param {Object} properties
 * 
 * @param {Unit} properties.unit Current Unit
 * 
 * @param {TPosition} properties.position Current position
 * 
 * @returns {ReactNode}
 */
export function GlobalContextProvider({ 
    children, 
    unit: firstUnit,
    position: firstPosition
} : TGlobalContextProvider) {

    const [ unit, setUnit ] = useState<Unit>(firstUnit);
    const [ position, setPosition ] = useState<TGlobalContextPosition>(firstPosition);
    const [ currentWeather, setCurrentWeather ] = useState<TIconData | null>(null);

    useEffect(() => {
        setUnit(firstUnit)
    }, [firstUnit]);

    useEffect(() => {
        setPosition(position)
    }, [position]);

    

    return (
        <GlobalContext.Provider value={{
            unit,
            position,
            currentWeather,
            setCurrentWeather
        }}>
            {children}
        </GlobalContext.Provider>
    )
}