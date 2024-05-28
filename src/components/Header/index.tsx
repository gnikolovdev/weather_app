import localforage from "localforage"

export default function Header() {
    const setUnits = (unit) => {
      alert(unit)
      localforage.setItem("unit", unit);
      location.reload();
    }
    return (
        <header className="header">
          <h1>Weather app</h1>
          <span onClick={() => {setUnits("metric")}}>Celsius</span>|<span onClick={() => {setUnits("imperial")}}>Fahrenheit</span>
        </header>
    )
}