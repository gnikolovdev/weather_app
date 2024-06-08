import { ThreeHourResponse, Unit } from "openweathermap-ts/dist/types";
import { getDateTime, UnitValues } from "@utilities/common";
import WeatherIcon from "@components/atoms/WeatherIcon";
import './index.scss';

export default function HourCard({ hour, unit } : { hour: ThreeHourResponse['list'][0], unit: Unit }) {
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