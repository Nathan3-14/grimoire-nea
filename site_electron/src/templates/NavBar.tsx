import { Outlet, useLocation } from "react-router-dom";
import GoToButton from "../components/GoToButton";
import { Settings } from "../App";
import "./NavBar.css"
import { GrimData } from "../pages/NewGrim";

export default function NavBar({settings}: {settings: Settings, grimData: GrimData}) {
    const location = useLocation();
    
    return <>
        <div id="nav-bar" style={{backgroundColor: settings.secondaryColour}}>
            <GoToButton to="/" settings={settings} secondary>Home</GoToButton>
            {location.pathname != "/grim" ? <GoToButton to="-1" settings={settings} secondary>Back</GoToButton> : ""}
            {/* {location.pathname != "/grim" ? <GoToButton to="-2" settings={settings} secondary>Back</GoToButton> : ""} */}
        </div>
        <Outlet />
    </>
}