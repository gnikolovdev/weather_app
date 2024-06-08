import { Unit } from "openweathermap-ts/dist/types";
import { TGlobalContext, GlobalContext } from "@contexts/GlobalContextProvider";
import React, { useContext } from "react";
import { UnitValues } from "@utilities/common";
import './index.scss';
import { Form, Link } from "react-router-dom";
import { cva } from "cva";

const buttonStyles = cva("header__form-button", {
  variants: {
    active: {
      true: "header__form-button--active",
    }
  }
});

type TheaderProps = {
  children: React.ReactNode
}

function HeaderRelativePlaceholder() {
  return <div className="header__relative-placeholder">&nbsp;</div>;
}

export default function Header({
  children
}:TheaderProps) {
    const { unit } = useContext(GlobalContext) as TGlobalContext;
    const isActive = (btnUnitVal: UnitValues): boolean => {
      if(btnUnitVal === unit) return true;
      else return false;
    }

    const setUnitHandler = (Unit: Unit) => {
      console.log(setUnitHandler, Unit);
    }

    

    return (
      <>
        <header className="header">
          <div className="header__content">
            <Link to={'/'}><h1 className="header__title">Weather app</h1></Link>
            {children}
            <>
              <Form className="header__form" method="POST">
                <button 
                  type="submit"
                  value={UnitValues.Metric}
                  name="unit" 
                  className={buttonStyles({active: isActive(UnitValues.Metric)})} 
                  onClick={() => {setUnitHandler(UnitValues.Metric )}}>
                    Celsius
                </button>
                <span>|</span>
                <button  
                  type="submit"
                  value={UnitValues.Imperial}
                  name="unit"  
                  className={buttonStyles({active: isActive(UnitValues.Imperial)})} 
                  onClick={() => {setUnitHandler(UnitValues.Imperial)}}>
                    Fahrenheit
                </button>
              </Form>
              
              
            </>
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
}buttonStyles