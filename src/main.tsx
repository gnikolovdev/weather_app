import React from 'react'
import ReactDOM from 'react-dom/client'
import App, { loader as AppLoader } from './App';
import { loader as mainLoader } from '@pages/ForecastByDays';
import './assets/styles/sass/index.scss';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ForecastByDays from '@pages/ForecastByDays';
import ForecastByHours from '@pages/ForeCastByHours';
import ErrorPage from '@pages/ErrorPage';

const router = createBrowserRouter([
  {
    element: <App />,
    loader: AppLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        loader: mainLoader,
        element: <ForecastByDays />,
      },
      {
        path: "/day/:dayId",
        element: <ForecastByHours />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLDivElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

