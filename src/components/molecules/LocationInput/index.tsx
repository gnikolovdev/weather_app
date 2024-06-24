import { Form } from "react-router-dom";



export default function LocationInput(){
    const locationString = location.pathname + location.search + location.hash;
    return (
        <Form className="unit-switcher" method="POST" action={locationString}>
            <input type="text" name="cityName" />
            <button 
              type="submit"
              value="change location"
              name="changeLocation">
                Change location
            </button>
        </Form>
    )
}