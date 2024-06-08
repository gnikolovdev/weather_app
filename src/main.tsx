import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import App, { 
  loader as AppLoader,
  action as AppAction
} from "./App";


import { QueryClient } from '@tanstack/react-query';
import ErrorPage from '@pages/ErrorPage';
import ForecastByDays, { loader as forecastByDaysLoader } from '@pages/ForecastByDays';
import ForecastByHours from '@pages/ForeCastByHours';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: AppLoader,
    action: AppAction,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        loader: () => { return forecastByDaysLoader( { queryClient }); },
        element: <ForecastByDays />,
      },
      {
        path: "/day/:dayId",
        loader: () => { return forecastByDaysLoader( { queryClient }); },
        element: <ForecastByHours />,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLDivElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

