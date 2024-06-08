import { CurrentResponse, ThreeHourResponse } from "openweathermap-ts/dist/types";

export default function WeatherIcon({data, className}: {data: ThreeHourResponse['list'][0] | CurrentResponse, className?: string}) {
    const icon = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    const iconName = data.weather[0].description;

    return <img className={className} src={icon} alt={iconName} title={iconName}/>;
}