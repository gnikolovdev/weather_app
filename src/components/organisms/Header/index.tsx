import { TGlobalContext, GlobalContext } from "@contexts/GlobalContextProvider";
import React, { useContext } from "react";
import "./index.scss";
import { Link } from "react-router-dom";
import UnitSwitcher from "@components/molecules/UnitSwitcher";
import WeatherIcon from "@components/atoms/WeatherIcon";

type TheaderProps = {
  children: React.ReactNode
}

function HeaderRelativePlaceholder() {
  return <div className="header__relative-placeholder">&nbsp;</div>;
}

/**
 * Component which represents Header
 * 
 * 
 * @returns {ReactNode}
 */
export default function Header({
}:TheaderProps) {
  
    const { unit, currentWeather } = useContext(GlobalContext) as TGlobalContext;    

    return (
      <>
        <header className="header">
          <div className="header__content">
            <Link to={"/"}><h1 className="header__title">Weather app</h1></Link>
            {currentWeather && <WeatherIcon data={currentWeather}/>}
            <UnitSwitcher unit={unit} />
          </div>        
        </header>
        <HeaderRelativePlaceholder />
      </>
    )
}

export function HeaderError() {    
    return (
      <>
        <header className="header">
          <div className="header__content">
            <h1 className="header__title">Weather app</h1>
          </div>        
        </header>
        <HeaderRelativePlaceholder />
      </>
    )
}