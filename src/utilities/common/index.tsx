import { DateTime } from "luxon";
import localforage from "localforage"

export function getUserLocation() {
    return new Promise( (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => resolve(position),
            error => reject(error)
        )
    })
}

export function isUserLocationSupported() {
    if(navigator && navigator.geolocation) {
        return true;
    } else {
        return false;
    }
}

export async function locationLoader() {
    if(!isUserLocationSupported()) {
        throw new Error('Your device do not support geolocation');
    }
    
    const location = await getUserLocation();
    return { location };
}

function groupWeatherByDay(list) {
    const days = new Map() // use Map as need we to maintain insertion order
  
    list.forEach( (w) => {
      const day = DateTime.fromMillis(w.dt*1000).toLocaleString(DateTime.DATE_SHORT);
      if( !days.get(day) ) days.set(day, []);
      
      days.get(day).push(w);
    })
    
    return days;
  }

async function weatherQuery() {
    const  { location } = await locationLoader();
    const lat = location.coords.latitude;
    const lon = location.coords.longitude;
    const API_KEY = import.meta.env.VITE_API_KEY;
    const unit = await localforage.getItem("unit");
    return `lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;
}

export async function getCurrentWeatherMap(){
    const query = await weatherQuery();
    const fetchUrl = `https://api.openweathermap.org/data/2.5/weather?${query}`;
    try{
        const response = await fetch(fetchUrl);
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }
        const data = await response.json();
        return data;
    } catch (e) {
        throw new Error("Current weather fetch failed: " + e.message);
    }
}

export async function get5DaysWeatherMap(){
    const query = await weatherQuery();
    const fetchUrl = `https://api.openweathermap.org/data/2.5/forecast?${query}`;
    try{
        const response = await fetch(fetchUrl);
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }
        const data = await response.json();
        const daysMap = groupWeatherByDay(data.list);
        return daysMap;
    } catch (e) {
        throw new Error("Days fetch failed: " + e.message);
    }
}