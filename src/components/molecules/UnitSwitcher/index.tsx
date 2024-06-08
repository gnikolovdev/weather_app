import { Form } from "react-router-dom";
import { UnitValues } from "@utilities/common";

import { cva } from "cva";
import { Unit } from "openweathermap-ts/dist/types";
import './index.scss';

const buttonStyles = cva("unit-switcher__button", {
  variants: {
    active: {
      true: "unit-switcher__button--active",
    }
  }
});

type TUnitSwitcher = {
    unit: Unit
}

export default function UnitSwitcher({
    unit    
}: TUnitSwitcher){

    const isActive = (btnUnitVal: UnitValues): boolean => {
        if(btnUnitVal === unit) return true;
        else return false;
    }

    return (
        <Form className="unit-switcher" method="POST">
            <button 
              type="submit"
              value={UnitValues.Metric}
              name="unit" 
              className={buttonStyles({active: isActive(UnitValues.Metric)})}>
                Celsius
            </button>
            <span>|</span>
            <button  
              type="submit"
              value={UnitValues.Imperial}
              name="unit"  
              className={buttonStyles({active: isActive(UnitValues.Imperial)})}>
                Fahrenheit
            </button>
          </Form>
    )
}