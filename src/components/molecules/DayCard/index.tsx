import { CurrentResponse, ThreeHourResponse } from "openweathermap-ts/dist/types";
import { Link } from "react-router-dom";
import { getDateTime } from "@utilities/common";
import WeatherIcon from "@components/atoms/WeatherIcon";
import "./index.scss";

/**
 * Component which displays day data
 * 
 * @param {Object} day Day data  
 * 
 * @returns {ReactNode} React component
 */
export default function DayCard({ day, index } : { day: ThreeHourResponse["list"][0] | CurrentResponse, index: number }) {
  const date = getDateTime({ dt: day.dt });
  //date.toLocaleString(); 
  return (
      <Link to={`day/${date.toFormat("dd-MM-yyyy")}`} className="day-card">
          <div className="day-card__relative-date">
              {index < 2 && date.toRelativeCalendar()}
              {index > 1 && date.toFormat("EEEE")}
          </div>
          <div className="day-card__formatted-date">
              {date.toFormat("MMMM d")}
          </div>            
          <div className="day-card__temp-now">
              {Math.round(day.main.temp)}&deg;
          </div>
          <div className="day-card__img">
              <WeatherIcon data={day.weather[0]} className="img" />
          </div>
          <div className="day-card__temp-min-max">
              {Math.round(day.main.temp_min)}&deg;<span className="day-card__separator">|</span>{Math.round(day.main.temp_max)}&deg;
          </div>            
      </Link>
  )
}