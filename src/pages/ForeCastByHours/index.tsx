import "./index.scss";
import { useAsyncValue, useLoaderData, useParams, Await, Link } from "react-router-dom";
import React, { useContext } from "react"
import { DateTime } from "luxon";
import { TDataLoader } from "@pages/ForecastByDays"
import { GlobalContext, TGlobalContext } from "@contexts/GlobalContextProvider";
import { TWeatherMapByDay} from "@utilities/common";
import LoadingAnimation from "@components/atoms/LoadingAnimation";
import HourCard from "@components/molecules/HourCard";


/**
 * Gets date from dayId in url params
 * and convert separation from "-" to "/"
 * 
 * @returns {string}
 */

function getFormattedDateStringFromDayId () {
    const { dayId } = useParams();
    return dayId?.split("-").join("/")!;
}

/**
 * Create content for page - e.g. cards for hours
 * 
 * @param {Object} props forecast data
 * 
 * @param {TWeatherMapByDay} props.data forecast data grouped by days
 * 
 * @returns {TDataLoader}
 */
function ForecastByHoursContent({data: nextDaysMap}: {data: TWeatherMapByDay}) {
    const { unit } = useContext(GlobalContext) as TGlobalContext;
    const dateString = getFormattedDateStringFromDayId();
    const day = nextDaysMap.get(dateString);
    if(day === undefined) {
        const date = DateTime.fromFormat(dateString, "dd/MM/yyyy");
        return (
            <div className="forecast-by-hour__container">
                Forecast do not contain hour data for: <strong>{date.toFormat("MMMM d")}</strong>
            </div>
        )
    }
    return (
        <>  
            <div className="forecast-by-hour__container">
                {day?.map((hour) => {
                    return <HourCard hour={hour} unit={unit} ></HourCard>
                })}
            </div>
        </>
    )
}

function ForecastByHoursAwaitedData() {
    const nextDaysMap = useAsyncValue() as TWeatherMapByDay;
     
    return <ForecastByHoursContent data={nextDaysMap} />
    
}

/**
 * Page which shows hour data per day
 * 
 * @returns {ReactNode}
 */
export default function ForecastByHours() {
    
    const { cachedForecast, haveData, lazyForecast } = useLoaderData() as TDataLoader;
    
    const dateString = getFormattedDateStringFromDayId();
    const date = DateTime.fromFormat(dateString, "dd/MM/yyyy");
    return (
        <div className="forecast-by-hour">
            <h2 className="forecast-by-hour__title">
                <Link to="/">Days</Link> &gt; <span className="forecast-by-hour__day">{date.toFormat("EEEE, dd MMMM")}</span>
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