import { ThreeHourResponse } from "openweathermap-ts/dist/types";
import { Link } from 'react-router-dom';
import { getDateTime } from "@utilities/common";
import WeatherIcon from "@components/atoms/WeatherIcon";
import './index.scss';

export default function DayCard({ day, index } : { day: ThreeHourResponse['list'][0], index: number }) {
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