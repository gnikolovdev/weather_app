import Header from "@components/Header";
import { Outlet, useLoaderData } from "react-router-dom";
import { getUserLocation, isUserLocationSupported } from "@utilities/common";
import { useState } from "react"
import { useQuery } from "@tanstack/react-query";

import localforage from "localforage";

export async function loader() {
  if(!isUserLocationSupported()) {
    throw new Error('Your device do not support geolocation');
  }

  const location = await getUserLocation();
  return { location };
}

export default function App() {
    return (
      <>
        <Header />
        <div className="pageContent">
          <Outlet />
        </div>
      </>
    );
  } 