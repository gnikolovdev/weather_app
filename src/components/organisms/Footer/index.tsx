import { DateTime } from "luxon";
import "./index.scss";

/**
 * Component which represents footer
 * 
 */
export default function Footer() {
    const now = DateTime.local();
    return (
        <footer className="footer">
          <div className="footer__content">
            &copy; {now.toFormat("yyyy")}
          </div>
        </footer>
    )
}