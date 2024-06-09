import { CurrentResponse, ThreeHourResponse } from "openweathermap-ts/dist/types";

export type TIconData = ThreeHourResponse['list'][0]['weather'][0] | CurrentResponse['weather'][0];

export default function WeatherIcon({data, className}: {data: TIconData, className?: string}) {
    const icon = `http://openweathermap.org/img/w/${data.icon}.png`;
    const iconName = data.description;

    return <img className={className} src={icon} alt={iconName} title={iconName}/>;
}