import React from 'react';

import { useLoaderData, defer, Await, useAsyncValue } from "react-router-dom"
import { 
    TWeatherMapByDay, 
    fiveDaysWeatherMapQuery,
    localDB
} from "@utilities/common";
import { QueryClient } from "@tanstack/react-query";
import './index.scss';
import LoadingAnimation from "@components/atoms/LoadingAnimation";
import DayCard from '@components/molecules/DayCard';

export type TDataLoader = {
    haveData: boolean,
    cachedForecast: TWeatherMapByDay | undefined,
    lazyForecast: Promise<TWeatherMapByDay>
    
}

export async function loader({queryClient} : {queryClient: QueryClient}) {
    
    const unit = await localDB.getUnit();
    
    const position = await localDB.getPosition();
    if(position !== null) {
        
        const query = fiveDaysWeatherMapQuery({ unit, position });
        //const queryCurrent = currenWeatherMapQuery({ unit, position });
        //const data = queryClient.getQueryData(queryCurrent.queryKey) ?? (await queryClient.fetchQuery(queryCurrent));
        return defer({
            haveData: true,
            lazyForecast: queryClient.fetchQuery(query),
            cachedForecast: queryClient.getQueryData(query.queryKey)
        })
    } else {
        
        return {
            haveData: false,
            deferQueries: null
        }
    }
}

function ForecastByDaysContent ({data} : {data: TWeatherMapByDay}) {
    const nextDaysArray = Array.from(data.entries());  
    
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
     
    return <ForecastByDaysContent data={nextDaysMap} />
}

export default function ForecastByDays() {
    
    const { cachedForecast, haveData, lazyForecast } = useLoaderData() as TDataLoader;
    
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