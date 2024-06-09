import { DateTime } from "luxon";
import OpenWeatherMap from 'openweathermap-ts';
import { CurrentResponse, ThreeHourResponse, Unit } from "openweathermap-ts/dist/types";
import localforage from "localforage";

const openWeatherAPI = new OpenWeatherMap({
    apiKey: import.meta.env.VITE_API_KEY
  });
 

/**
 * Check if device support geolocation
 * 
 * @returns boolean
 */
export function isUserLocationSupported() {
    if(navigator && navigator.geolocation) {
        return true;
    } else {
        return false;
    }
}


/**
 * Returns user geolocation
 * 
 * @returns {Promise<GeolocationPosition>}
 */
export async function getUserLocation(): Promise<GeolocationPosition> {
    return new Promise( (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => resolve(position),
            error => reject(error)
        )
    })
}


/**
 * Enums possible Unit values
 * 
 * @returns {enum}
 */
export enum UnitValues {
    Metric = 'metric',
    Imperial = 'imperial',
    Standart = 'standart'
}

export type TUnitValuesUnion = `${UnitValues}`;

/* localDB */

/**
 * Returns unit values stored on local db
 * 
 * @returns {Promise<Unit>}
 */
const getUnit = async (): Promise<Unit> => {
    return await localforage.getItem('unit') || UnitValues.Metric;
}


/**
 * Sets preferred unit value on local db
 * 
 * @param {Unit} unit
 * @returns {Promise<Unit>}
 */
const setUnit = async (unit: Unit): Promise<Unit> => {
    const result = await localforage.setItem('unit', unit);
    return result;
}

const POSITION_ITEM_KEY = 'position';
export type TPosition = {
    lat: number,
    lon: number
}

export type TPositionItem = {
    expire: number,
    position: TPosition
}

/**
 * 
 * Sets current position to local db
 * 
 * @param {Object} props
 * 
 * @params {TPosition} props.position
 * 
 * @returns {Promise<TPositionItem>} 
 */
const setPosition = async({position}: {position: TPosition}) => {
    const pos = {
        lat: position.lat,
        lon: position.lon
    }

    await localforage.setItem(POSITION_ITEM_KEY, {
        expire: Date.now() + (1000 * 60 * 60), // 1 hour from now
        position: pos
    })
}

export type TGetPosition = Promise<TPosition | null>;

/**
 * 
 * Gets current position from local db
 * 
 * @returns {TGetPosition}
 */
const getPosition = async (): TGetPosition => {
    const positionItem = await localforage.getItem(POSITION_ITEM_KEY) as TPositionItem;
    
    if(positionItem && positionItem.expire > Date.now()) {
        return positionItem.position;
    }
    
    return null;
}


/**
 * Removes current position from local db
 * 
 * @returns {Promise<void>}
 */
const removePosition = async (): Promise<void> => {
    return await localforage.removeItem(POSITION_ITEM_KEY);
}

export const localDB = {
    getUnit,
    setUnit,
    getPosition,
    setPosition,
    removePosition
}

/* localDB -- END -- */


export function fixMS( { dt }: {dt: number}) {
    return dt * 1000;
}

export type TWeatherMapByDay = Map<string, Array<ThreeHourResponse['list'][0]>>;

/**
 * Get Luxon DateTime object from milliseconds
 * 
 * @param {Object} properties
 * 
 * @param {number} properties.dt date in milliseconds
 *  
 * @returns 
 */
export const getDateTime = ({dt} : {dt: number}): DateTime => {
    return DateTime.fromMillis(fixMS({dt}));
}


type TWeatherQueries = {
    unit: Unit,
    position: TPosition
}

type T5DayQuery = {
    queryKey: string[],
    queryFn: () => Promise<TWeatherMapByDay>
}

type TCurrentQuery = {
    queryKey: string[],
    queryFn: () => Promise<CurrentResponse>
}

/**
 * 
 * returns react query key and function for 5 days forecast
 * 
 * @param {Object} properties
 * @param {Unit} properties.unit 
 * @param {TPosition} properties.position
 * @returns {T5DayQuery}
 */
export const fiveDaysWeatherMapQuery = ({ unit, position } : TWeatherQueries): T5DayQuery => ({
    queryKey: ['fiveDaysWeather', unit, position.lat.toString() + position.lon.toString()],  
    queryFn: async () => get5DaysWeatherMap({ unit, position }),  
})

/**
 * 
 * returns react query key and function for current day forecast
 * 
 * @param {Object} properties
 * @param {Unit} properties.unit 
 * @param {TPosition} properties.position
 * @returns {T5DayQuery}
 */
export const currenWeatherMapQuery = ({ unit, position } : TWeatherQueries): TCurrentQuery => ({
    queryKey: ['currentWeather', unit, position.lat.toString() + position.lon.toString()],  
    queryFn: async () => getCurrentWeatherMap({ unit, position }),  
})


/**
 * 
 * returns data for current day forecast
 * 
 * @param {Object} properties
 * @param {Unit} properties.unit 
 * @param {TPosition} properties.position
 * @returns {TWeatherQueries}
 */
export async function getCurrentWeatherMap({ unit, position } : TWeatherQueries){
    openWeatherAPI.setUnits(unit);
    
    try{
        const data = await openWeatherAPI.getCurrentWeatherByGeoCoordinates(position.lat, position.lon);
        return data;
    } catch (e: any) {
        throw new Error("Current weather fetch failed: " + e.message);
    }
}

/**
 * 
 * returns data for 5 days forecast
 * 
 * @param {Object} properties
 * @param {Unit} properties.unit 
 * @param {TPosition} properties.position
 * @returns {TWeatherQueries}
 */
export async function get5DaysWeatherMap({ unit, position } : TWeatherQueries){
    openWeatherAPI.setUnits(unit);
    try{
        const weatherData = await openWeatherAPI.getThreeHourForecastByGeoCoordinates(position.lat, position.lon)
        return groupWeatherByDay(weatherData.list);
    } catch (e: any) {
        throw new Error("Days fetch failed: " + e.message);
    }
}


/**
 * 
 * returns data for 5 days forecast grouped by day
 * 
 * @param {Object} properties
 * @param {Unit} properties.unit 
 * @param {TPosition} properties.position
 * @returns {TWeatherMapByDay}
 */
function groupWeatherByDay(list: ThreeHourResponse['list']): TWeatherMapByDay {
    
    const days = new Map(); //use Map as need we to maintain insertion order
    list.forEach( (w) => {
        const day = getDateTime({ dt: w.dt }).toFormat('dd/MM/yyyy');
        if( !days.get(day) ) {
            
            days.set(day, []);
        }
      
        days.get(day).push(w);
    })
    
    return days;
  }