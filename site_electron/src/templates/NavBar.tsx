import { Outlet, useLocation } from "react-router-dom";
import GoToButton from "../components/GoToButton";
import { Settings } from "../App";
import "./NavBar.css"
import { GrimData } from "../pages/NewGrim";

export default function NavBar({settings}: {settings: Settings, grimData: GrimData}) {
    const location = useLocation();
    console.log(location.pathname);
    
    const routes = [
        "/grim/create",
        "/grim/create/scriptselect",
        "/grim/create/characterselect",
        "/grim"
    ];
    const routeToGuide: {[route: string]: string} = {
        "/grim/create": "setup",
        "/grim/create/scriptselect": "script-select",
        "/grim/create/characterselect": "character-select",
        "/grim": "grim"
    }
    
    return <>
        <div id="nav-bar" style={{backgroundColor: settings.secondaryColour}}>
            <GoToButton to="/" settings={settings} secondary>Home</GoToButton>
            {location.pathname != "/grim" ? <GoToButton to="-1" settings={settings} secondary>Back</GoToButton> : ""}
            {/* {location.pathname != "/grim" ? <GoToButton to="-2" settings={settings} secondary>Back</GoToButton> : ""} */}
            {routes.includes(location.pathname) ?
                <GoToButton secondary to="/guide" settings={settings} onClick={() => {
                    console.log(`${location.pathname}'s guideID is ${routeToGuide[location.pathname]}`);
                    settings.setSelectedGuide(routeToGuide[location.pathname]);
                }}>Guide</GoToButton> :
                ""
            }
        </div>
        <Outlet />
    </>
}