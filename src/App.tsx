import Header from "@components/organisms/Header";
import { Outlet, useLoaderData } from "react-router-dom";
import { localDB, isUserLocationSupported, getUserLocation, TPosition, UnitValues, getLocationByCityQuery } from "@utilities/common";
import React, {useEffect } from "react";
import { Unit } from "openweathermap-ts/dist/types";
import { useRevalidator, defer, Await } from "react-router-dom";
import Footer from "@components/organisms/Footer";
import "./App.scss";
import { GlobalContextProvider } from "@contexts/GlobalContextProvider";
import LoadingAnimation from "@components/atoms/LoadingAnimation";
import { QueryClient } from "@tanstack/react-query";

type TLoader = {
  position: Promise<GeolocationPosition>,
  positionCached: TPosition
  unit: Unit
}

/**
 * loader for app page component
 * 
 * @returns {TLoader}
 */
export async function loader() {
  if(!isUserLocationSupported()) {
    throw new Error("Your device do not support geolocation");
  }

  
  let positionCached = await localDB.getPosition();
  return defer ({ 
    unit: await localDB.getUnit(),
    positionCached: positionCached,
    position: positionCached ? null : getUserLocation()
  });
}

/**
 * action for app page component
 * 
 * @returns {TLoader}
 */
export async function action( { request, queryClient } : { request : Request, queryClient: QueryClient}) {
  let formData = await request.formData();

  const changeForm = formData.get("changeLocation")
  if(changeForm) {

    const cityName = formData.get("cityName") as string;
    const query = getLocationByCityQuery({ cityName });
    let cityPos;
    
    cityPos = await queryClient.fetchQuery(query);
  
    if(cityPos.cod !== 200) {
      alert(cityPos.message);
    } else {
      const positionParam = {lat: cityPos.coord.lat, lon: cityPos.coord.lon};
      await localDB.setPosition({position: positionParam});
    }
    
  } else {
    let unit = formData.get("unit") as Unit;
    
    if ((Object.values(UnitValues) as string[]).includes(unit)) {
      localDB.setUnit(unit);
    } else {
      throw new Error(`Unit is not supported: ${unit}`)
    }
  }

  
  return {ok: true};
}


/**
 * 
 * component which is shown while waiting for position
 * 
 * @returns {ReactNode}
 */
function PositionLoading() {
  return (
    <div className="app__content">
      <div className="flat">
        <LoadingAnimation /><p style={{fontSize: "1.5rem"}}>Waiting for position...</p>
      </div>
    </div>
  );
}

/**
 * 
 * component which triggeres revalidation when position is loaded
 * 
 * @returns {ReactNode}
 */
function PostionLoaded({ position }: {position: GeolocationPosition}) {
  const revalidator = useRevalidator();
  const positionParam = {lat: position.coords.latitude, lon: position.coords.longitude};
  
  useEffect(() => {
    (async function() {
      await localDB.setPosition({position: positionParam});
      revalidator.revalidate();
    })();
  }, []);
  return <PositionLoading />;
}

/**
 * 
 * component which awaits for position
 * shown from first load of page
 * 
 * @returns {ReactNode}
 */
function AwaitPositionData({position}: { position: Promise<GeolocationPosition> }) {
  return (
    <React.Suspense
            fallback={<PositionLoading />}
          >
      <Await
        resolve={position}
      >
        {(positionData) => (
          <PostionLoaded position={positionData} />
        )}
      </Await>
    </React.Suspense>
  )
}

/**
 * 
 * Layout component for the app
 * 
 * @returns {ReactNode}
 */
export default function App() {
    const { unit, position, positionCached } = useLoaderData() as TLoader;
    
    return (
      <GlobalContextProvider unit={unit} position={positionCached}>
        <Header></Header>
          {positionCached === null && <AwaitPositionData position={position} />}
          {positionCached !== null && 
            <Outlet />
          }
        <Footer />
      </GlobalContextProvider>      
    );
  }