import Header from "@components/organisms/Header";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { localDB, isUserLocationSupported, getUserLocation, TPosition, UnitValues,
  TGetPosition
 } from "@utilities/common";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { GlobalContext, TGlobalContext } from "@contexts/GlobalContextProvider";
import React, { useContext, useEffect, useState } from "react";
import { CurrentResponse, Unit } from "openweathermap-ts/dist/types";
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

  console.log('call AppLoader');
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

export default function App({queryClient}: {queryClient: QueryClient}) {
    const { unit, position, positionCached } = useLoaderData() as TLoader;
    console.log('app loader return: ', unit, positionCached, position);
    //const submit = useSubmit();
    console.log("positionCached", positionCached);
    return (
      <>
        <QueryClientProvider client={queryClient}>
          <GlobalContextProvider unit={unit} position={positionCached}>
            <Header><></></Header>             
              {positionCached === null && <React.Suspense
                fallback={<PositionLoading />}
              >
                <Await
                  resolve={position}
                >
                  {(positionData) => (
                    <PostionLoaded position={positionData} />
                  )}
                </Await>
              </React.Suspense>}
              {positionCached !== null && <Outlet />}
            <Footer />
          </GlobalContextProvider>
        </QueryClientProvider>
      </>
    );
  } 