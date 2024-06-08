import { useRouteError } from "react-router-dom";
import './index.scss';
import { HeaderError } from "@components/organisms/Header";
import Footer from "@components/organisms/Footer";

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);
  let stack = error instanceof Error ? error.stack : null;
  return (
    <>
      <HeaderError />
  
        <div className="error__content">
          <h1>Weather app</h1>
          <p>Sorry, an unexpected error has occurred:</p>
          <p className="error__description">
            <i>{error.statusText || error.message}</i>
            
          </p>
          {stack ? <pre className="error__stack">{stack}</pre> : null}
        </div>
      
      <Footer />      
    </>
  );
}