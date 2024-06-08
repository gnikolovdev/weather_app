import { DateTime } from "luxon";
import OpenWeatherMap from 'openweathermap-ts';
import { ThreeHourResponse, Unit } from "openweathermap-ts/dist/types";
import localforage from "localforage";

const openWeatherAPI = new OpenWeatherMap({
    apiKey: import.meta.env.VITE_API_KEY
  });
 


export function isUserLocationSupported() {
    if(navigator && navigator.geolocation) {
        return true;
    } else {
        return false;
    }
}

export async function getUserLocation(): Promise<GeolocationPosition> {
    return new Promise( (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => resolve(position),
            error => reject(error)
        )
    })
}

export enum UnitValues {
    Metric = 'metric',
    Imperial = 'imperial',
    Standart = 'standart'
}

export type TUnitValuesUnion = `${UnitValues}`;

/* localDB */
const getUnit = async (): Promise<Unit> => {
    return await localforage.getItem('unit') || UnitValues.Metric;
}

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
const setPosition = async({position}: {position: TPosition}) => {
    const pos = {
        lat: position.lat,
        lon: position.lon
    }

    await localforage.setItem(POSITION_ITEM_KEY, {
        expire: Date.now() * 1000 * 60 * 60, // 1 hour from now
        position: pos
    })
}

export type TGetPosition = Promise<TPosition | null>;

const getPosition = async (): TGetPosition => {
    const positionItem = await localforage.getItem(POSITION_ITEM_KEY) as TPositionItem;
    console.log("get position", positionItem)
    if(positionItem && positionItem.expire > Date.now()) {
        return positionItem.position;
    }
    
    return null;
}

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


export type TWeatherMapByDay = Map<string, Array<ThreeHourResponse['list'][0]>>;

export function fixMS({ dt } : {dt: number}) {
    return dt * 1000;
}

export const getDateTime = ({dt_txt} : {dt_txt: string}): DateTime => {
    return DateTime.fromFormat(dt_txt, 'yyyy-MM-dd hh:mm:ss');
}

/* queries start */

type TWeatherQueries = {
    unit: Unit,
    position: TPosition
}

export const fiveDaysWeatherMapQuery = ({ unit, position } : TWeatherQueries) => ({
    queryKey: ['fiveDaysWeather', unit, position.lat.toString() + position.lon.toString()],  
    queryFn: async () => get5DaysWeatherMap({ unit, position }),  
})

export const currenWeatherMapQuery = ({ unit, position } : TWeatherQueries) => ({
    queryKey: ['currentWeather', unit, , position.lat.toString() + position.lon.toString()],  
    queryFn: async () => getCurrentWeatherMap({ unit, position }),  
})

export async function getCurrentWeatherMap({ unit, position } : TWeatherQueries){
    openWeatherAPI.setUnits(unit);
    
    try{
        const data = await openWeatherAPI.getCurrentWeatherByGeoCoordinates(position.lat, position.lon);
        return data;
    } catch (e: any) {
        throw new Error("Current weather fetch failed: " + e.message);
    }
}

export async function get5DaysWeatherMap({ unit, position } : TWeatherQueries){
    openWeatherAPI.setUnits(unit);
    try{
        const weatherData = await openWeatherAPI.getThreeHourForecastByGeoCoordinates(position.lat, position.lon)
        return groupWeatherByDay(weatherData.list);
    } catch (e: any) {
        throw new Error("Days fetch failed: " + e.message);
    }
}

function groupWeatherByDay(list: ThreeHourResponse['list']): TWeatherMapByDay {
    console.log("dataLIst", list)
    const days = new Map(); //use Map as need we to maintain insertion order
    list.forEach( (w) => {
        const day = getDateTime({ dt_txt: w.dt_txt }).toFormat('dd/MM/yyyy');
        if( !days.get(day) ) {
            console.log("day", day)
            days.set(day, []);
        }
      
        days.get(day).push(w);
    })
    console.log("days", days);
    return days;
  }