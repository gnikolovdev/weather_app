import { Unit } from 'openweathermap-ts/dist/types';
import { TPosition } from '@utilities/common';
import { 
    createContext,
    useState,
    useEffect
} from 'react';

export type TGlobalContextPosition = TPosition | null;

export type TGlobalContext = {
    unit: Unit,
    //setUnit: React.Dispatch<SetStateAction<Unit>>
    position: TGlobalContextPosition
}


export const GlobalContext = createContext<TGlobalContext | null>(null);

export type TGlobalContextProvider = {
    children: React.ReactNode;
    unit: Unit,
    position: TPosition
}

export function GlobalContextProvider({ 
    children, 
    unit: firstUnit,
    position: firstPosition
} : TGlobalContextProvider) {

    const [ unit, setUnit ] = useState<Unit>(firstUnit);
    const [ position, setPosition ] = useState<TGlobalContextPosition>(firstPosition);

    useEffect(() => {
        setUnit(firstUnit)
    }, [firstUnit]);

    useEffect(() => {
        setPosition(position)
    }, [position]);

    

    return (
        <GlobalContext.Provider value={{
            unit,
            position
        }}>
            {children}
        </GlobalContext.Provider>
    )
}