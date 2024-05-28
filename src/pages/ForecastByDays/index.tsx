//import localforage from "localforage";
import { useLoaderData } from "react-router-dom"
import { get5DaysWeatherMap } from "@utilities/common";

export async function loader() {
    const nextDays = await get5DaysWeatherMap();
    return { nextDays };
}

function Icon({day}) {
    const icon = `http://openweathermap.org/img/w/${day.weather[0].icon}.png`;
    const iconName = day.weather[0].description;

    return <img src={icon} alt={iconName} title={iconName}/>;
}

export default function ForecastByDays() {
    const { nextDays } = useLoaderData();
    const array = Array.from(nextDays.entries());    
    const listItems = array.map((day) => { console.log(day[1][0]);return <li>
        {day[1][0].main.temp_max} <Icon day={day[1][0]} />
    </li>});
    return (
        <div>
            ForecastByDays
            <br></br>
            <ul>
                {listItems}
            </ul>
            
        </div>
    )
}