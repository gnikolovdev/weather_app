import Header from "@components/organisms/Header";
import { Outlet, useLoaderData } from "react-router-dom";
import { localDB, isUserLocationSupported, getUserLocation, TPosition, UnitValues } from "@utilities/common";
import React, {useEffect } from "react";
import { Unit } from "openweathermap-ts/dist/types";
import { useRevalidator, defer, Await } from "react-router-dom";
import Footer from "@components/organisms/Footer";
import './App.scss';
import { GlobalContextProvider } from "@contexts/GlobalContextProvider";
import LoadingAnimation from "@components/atoms/LoadingAnimation";

type TLoader = {
  position: Promise<GeolocationPosition>,
  positionCached: TPosition
  unit: Unit
}
export async function loader() {
  if(!isUserLocationSupported()) {
    throw new Error('Your device do not support geolocation');
  }

  
  let positionCached = await localDB.getPosition();
  return defer ({ 
    unit: await localDB.getUnit(),
    positionCached: positionCached,
    position: positionCached ? null : getUserLocation()
  });
}


export async function action( { request } : { request : Request}) {
  let formData = await request.formData();
  let unit = formData.get("unit") as Unit;
  
  if ((Object.values(UnitValues) as string[]).includes(unit)) {
    localDB.setUnit(unit);
  } else {
    throw new Error(`Unit is not supported: ${unit}`)
  }
  
  return {ok: true};
}

function PositionLoading() {
  return (
    <div className="app__content">
      <div className="flat">
        <LoadingAnimation /><p style={{fontSize: "1.5rem"}}>Waiting for position...</p>
      </div>
    </div>
  );
}

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

export default function App() {
    const { unit, position, positionCached } = useLoaderData() as TLoader;
    
    return (
      <GlobalContextProvider unit={unit} position={positionCached}>
        <Header><></></Header>             
          {positionCached === null && <AwaitPositionData position={position} />}
          {positionCached !== null && <Outlet />}
        <Footer />
      </GlobalContextProvider>      
    );
  }