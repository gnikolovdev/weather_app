import React, { useContext, useEffect } from "react";

import { useLoaderData, defer, Await, useAsyncValue } from "react-router-dom"
import { 
    TWeatherMapByDay, 
    fiveDaysWeatherMapQuery,
    currenWeatherMapQuery,
    localDB,
    getDateTime
} from "@utilities/common";
import { QueryClient } from "@tanstack/react-query";
import "./index.scss";
import LoadingAnimation from "@components/atoms/LoadingAnimation";
import DayCard from "@components/molecules/DayCard";
import { CurrentResponse } from "openweathermap-ts/dist/types";
import { DateTime } from "luxon";
import { GlobalContext, TGlobalContext } from "@contexts/GlobalContextProvider";
import LocationInput from "@components/molecules/LocationInput";

export type TDataLoader = {
    haveData: boolean,
    cachedForecast: TWeatherMapByDay | undefined,
    lazyForecast: Promise<TWeatherMapByDay> | null,
    cachedCurrent: CurrentResponse | undefined,
    lazyCurrent: Promise<CurrentResponse> | null 
}


/**
 * Forecast page loader - make requests for forecast data
 * 
 * @param {QueryClient} queryClient which makes requests 
 * @returns {TDataLoader}
 */
export async function loader({queryClient} : {queryClient: QueryClient}) {
    
    const unit = await localDB.getUnit();
    
    const position = await localDB.getPosition();
    if(position !== null) {
        
        const query = fiveDaysWeatherMapQuery({ unit, position });
        const queryCurrent = currenWeatherMapQuery({ unit, position });
        const cachedCurrent = queryClient.getQueryData(queryCurrent.queryKey);
        const cachedForecast = queryClient.getQueryData(query.queryKey);
        return defer({
            haveData: true,
            cachedForecast: cachedForecast,
            lazyForecast: cachedForecast ? null : queryClient.fetchQuery(query),
            cachedCurrent: cachedCurrent,
            lazyCurrent: cachedCurrent ? null : queryClient.fetchQuery(queryCurrent),
        })
    } else {
        
        return {
            haveData: false,
            cachedForecast: null,
            lazyForecast: null,
            cachedCurrent: null,
            lazyCurrent: null
        }
    }
}


/**
 * Create content for page - e.g. cards for days
 * 
 * @param {Object} props forecast data
 * 
 * @param {TWeatherMapByDay} props.data forecast data grouped by days
 * 
 * @returns {TDataLoader}
 */
function ForecastByDaysContent ({data} : {data: TWeatherMapByDay}) {
    let nextDaysArray = Array.from(data.entries());
    const firsDayDate = getDateTime({dt: nextDaysArray[0][1][0].dt});

    // forecast returns 3 hours response starting from next 3 hours
    // so it is possible to not return data for current day
    // if current time is different from GMT
    if(firsDayDate.day !== DateTime.now().day) {
        nextDaysArray = nextDaysArray.slice(0, 4);
    } else {
        nextDaysArray = nextDaysArray.slice(1, 5);
    }
     
    const listItems = nextDaysArray.map((day, index) => {
        return <DayCard day={day[1][5]} index={index + 1} />
    });
    return (
        <>
            {listItems}
        </>
    )
}

function ForecastByDaysAwaitedData () {
    const nextDaysMap = useAsyncValue() as TWeatherMapByDay;
     
    return <ForecastByDaysContent data={nextDaysMap} />
}

/**
 * Create content for page - e.g. cards for days
 * 
 * @param {Object} props forecast data
 * 
 * @param {TWeatherMapByDay} props.data forecast data grouped by days
 * 
 * @returns {TDataLoader}
 */
function CurrentDayContent ({data} : {data: CurrentResponse}) {
    const { setCurrentWeather } = useContext(GlobalContext) as TGlobalContext;
    useEffect(() => {
        setCurrentWeather(data.weather[0]);
    }, [data.weather[0]]);
    return <DayCard day={data} index={0} />
}


function CurrentAwaitedData () {
    const currentDayData = useAsyncValue() as CurrentResponse;
    
    return <CurrentDayContent data={currentDayData} />
}


/**
 * Page which shows 5 day weather forecast
 * 
 * @returns {ReactNode}
 */
export default function ForecastByDays() {
    
    const { 
        haveData, 
        cachedForecast, 
        lazyForecast,
        cachedCurrent,
        lazyCurrent 
    } = useLoaderData() as TDataLoader;
    
    return (
        <div className="forecast5">
            
            <LocationInput />
            
            <h2 className="forecast5__title">
                Forecast by days:
            </h2>
            <div className="forecast5__days-container">
                {haveData && !cachedCurrent && <React.Suspense fallback={<LoadingAnimation />}>
                    <Await resolve={lazyCurrent}>
                        <CurrentAwaitedData />
                    </Await>
                </React.Suspense>}
                {haveData && cachedCurrent && <CurrentDayContent data={cachedCurrent} />}
                {haveData && !cachedForecast && <React.Suspense fallback={<LoadingAnimation />}>
                    <Await resolve={lazyForecast}>
                        <ForecastByDaysAwaitedData />
                    </Await>
                </React.Suspense>}
                {haveData && cachedForecast && <ForecastByDaysContent data={cachedForecast} />}
            </div>
        </div>
    )
    
}