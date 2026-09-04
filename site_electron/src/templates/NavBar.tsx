import { Outlet } from "react-router-dom";
import GoToButton from "../components/GoToButton";
import { Settings } from "../App";
import "./NavBar.css"

export default function NavBar({settings}: {settings: Settings}) {
    return <>
        <div id="nav-bar" style={{backgroundColor: settings.secondaryColour}}>
            <GoToButton to="/" settings={settings} >Home</GoToButton>
        </div>
        <Outlet />
    </>
}