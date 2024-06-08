import './index.scss';
import { useAsyncValue, useLoaderData, useParams, Await } from 'react-router-dom';
import WeatherIcon from '@components/atoms/WeatherIcon';
import { ThreeHourResponse } from 'openweathermap-ts/dist/types';
import React, { useContext } from "react"
import { DateTime } from 'luxon';
import { TDataLoader } from '@components/pages/ForecastByDays'
import { GlobalContext, TGlobalContext } from '@contexts/GlobalContextProvider';
import { TWeatherMapByDay, getDateTime, UnitValues} from '@utilities/common';
import LoadingAnimation from '@components/atoms/LoadingAnimation';

function HourCard({ hour } : { hour: ThreeHourResponse['list'][0] }) {

    const { unit } = useContext(GlobalContext) as TGlobalContext;
    const date = getDateTime({ dt_txt: hour.dt_txt });

    return (
        <div className='hour-card'>
            <div className='hour-card__time'>
                {date.toFormat('HH:mm a')}
            </div>
            <div className='hour-card__icon'>
                <WeatherIcon data={hour} className="img" />
            </div>
            <div className='hour-card__temp'>
                {Math.round(hour.main.temp)}&deg;
            </div>
            <div className='hour-card__description'>
                {hour.weather[0].description}
            </div>
            <div className='hour-card__wind'>
                {Math.round(hour.wind.speed)} { unit === UnitValues.Metric ? 'm/s' : 'knots' } 
            </div>
        </div>
    )
}

function getFormattedDateStringFromDayId () {
    const { dayId } = useParams();
    return dayId?.split('-').join('/')!;
}

function ForecastByHoursContent({data: nextDaysMap}: {data: TWeatherMapByDay}) {
    const dateString = getFormattedDateStringFromDayId();
    const day = nextDaysMap.get(dateString);
    if(day === undefined) {
        throw new Error("wrong date");
    }
    return (
        <>  
            <div className='forecast-by-hour__container'>
                {day?.map((hour) => {
                    return <HourCard hour={hour} ></HourCard>
                })}
            </div>
        </>
    )
}

function ForecastByHoursAwaitedData() {
    const nextDaysMap = useAsyncValue() as TWeatherMapByDay;
    console.log(nextDaysMap); 
    return <ForecastByHoursContent data={nextDaysMap} />
    
}

export default function ForecastByHours() {
    console.log("ForecastByDays");
    const { cachedForecast, haveData, lazyForecast } = useLoaderData() as TDataLoader;
    console.log("loader data", cachedForecast, haveData, lazyForecast);
    const dateString = getFormattedDateStringFromDayId();
    const date = DateTime.fromFormat(dateString, 'dd/MM/yyyy');
    return (
        <div className='forecast-by-hour'>
            <h2 className="forecast-by-hour__title">
                <span className='forecast-by-hour__day'>{date.toFormat('EEEE, dd MMMM')}</span>
            </h2>
           {haveData && !cachedForecast && <React.Suspense fallback={<LoadingAnimation />}>
                <Await resolve={lazyForecast}>
                    <ForecastByHoursAwaitedData />
                </Await>
            </React.Suspense>}
            {haveData && cachedForecast && <ForecastByHoursContent data={cachedForecast} />}
        </div>
    )
    
}