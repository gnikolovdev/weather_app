import { Unit } from 'openweathermap-ts/dist/types';
import { TPosition } from '@utilities/common';
import { 
    Children, 
    SetStateAction, 
    useContext, 
    createContext,
    useState,
    useEffect
} from 'react';
import { localDB } from '@utilities/common';

export type TGlobalContext = {
    unit: Unit,
    //setUnit: React.Dispatch<SetStateAction<Unit>>
    position: TGlobalContextPosition
}

export type TGlobalContextPosition = TPosition | null;

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

    console.log('unit from provider', unit);

    return (
        <GlobalContext.Provider value={{
            unit,
            position
        }}>
            {children}
        </GlobalContext.Provider>
    )
}