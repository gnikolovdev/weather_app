import React, { } from 'react';

import { Link, useLoaderData, defer, Await, useAsyncValue } from "react-router-dom"
import { 
    TWeatherMapByDay, 
    fiveDaysWeatherMapQuery, 
    getDateTime, 
    localDB
} from "@utilities/common";
import { ThreeHourResponse } from "openweathermap-ts/dist/types";
import { QueryClient } from "@tanstack/react-query";
import './index.scss';
import WeatherIcon from "@components/atoms/WeatherIcon";
import LoadingAnimation from "@components/atoms/LoadingAnimation";

export type TDataLoader = {
    haveData: boolean,
    cachedForecast: TWeatherMapByDay | undefined,
    lazyForecast: Promise<TWeatherMapByDay>
    
}

export async function loader({queryClient} : {queryClient: QueryClient}) {
    console.log("5day loader");
    const unit = await localDB.getUnit();
    console.log("5day loader", unit);
    const position = await localDB.getPosition();
    if(position !== null) {
        console.log('hasPostion');
        const query = fiveDaysWeatherMapQuery({ unit, position });
        //const queryCurrent = currenWeatherMapQuery({ unit, position });
        //const data = queryClient.getQueryData(queryCurrent.queryKey) ?? (await queryClient.fetchQuery(queryCurrent));
        return defer({
            haveData: true,
            lazyForecast: queryClient.fetchQuery(query),
            cachedForecast: queryClient.getQueryData(query.queryKey)
        })
    } else {
        console.log('noPosition');
        return {
            haveData: false,
            deferQueries: null
        }
    }
}

function DayCard({ day, index } : { day: ThreeHourResponse['list'][0], index: number }) {
    const date = getDateTime({ dt_txt: day.dt_txt });
    //date.toLocaleString(); 
    return (
        <Link to={`day/${date.toFormat('dd-MM-yyyy')}`} className="day-card">
            <div className="day-card__relative-date">
                {index < 2 && date.toRelativeCalendar()}
                {index > 1 && date.toFormat('EEEE')}
            </div>
            <div className="day-card__formatted-date">
                {date.toFormat('d MMMM')}
            </div>            
            <div className="day-card__temp-now">
                {Math.round(day.main.temp)}&deg;
            </div>
            <div className="day-card__img">
                <WeatherIcon data={day} className="img" />
            </div>
            <div className="day-card__temp-min-max">
                {Math.round(day.main.temp_min)}&deg;<span className="day-card__separator">|</span>{Math.round(day.main.temp_max)}&deg;
            </div>            
        </Link>
    )
}

function ForecastByDaysContent ({data} : {data: TWeatherMapByDay}) {
    const nextDaysArray = Array.from(data.entries());  
    console.log(nextDaysArray);
    if(nextDaysArray.length > 5) nextDaysArray.pop();  
    const listItems = nextDaysArray.map((day, index) => {
        if(index === 0)
            return <DayCard day={day[1][0]} index={index} />
        else 
            return <DayCard day={day[1][5]} index={index} />
    });
    return (
        <div className="forecast5__days-container">
            {listItems}
        </div>
    )
}

function ForecastByDaysAwaitedData () {
    const nextDaysMap = useAsyncValue() as TWeatherMapByDay;
    console.log(nextDaysMap); 
    return <ForecastByDaysContent data={nextDaysMap} />
}

export default function ForecastByDays() {
    console.log("ForecastByDays");
    const { cachedForecast, haveData, lazyForecast } = useLoaderData() as TDataLoader;
    console.log("loader data", cachedForecast, haveData, lazyForecast);
    return (
        <div className="forecast5">
            <h2 className="forecast5__title">
                Forecast by days:
            </h2>
           {haveData && !cachedForecast && <React.Suspense fallback={<LoadingAnimation />}>
                <Await resolve={lazyForecast}>
                    <ForecastByDaysAwaitedData />
                </Await>
            </React.Suspense>}
            {haveData && cachedForecast && <ForecastByDaysContent data={cachedForecast} />}
        </div>
    )
    
}