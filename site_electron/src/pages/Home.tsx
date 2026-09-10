import type { Settings } from "../App"
import GoToButton from "../components/GoToButton"
import "./Home.css"
import { GrimData } from "./NewGrim"

export default function Home({settings, grimData}: {settings: Settings, grimData: GrimData}) {
    return <div className="page">
        <h1>Grimoire</h1>
        <GoToButton settings={settings} to="/grim" style={{display: grimData.isGrimActive ? "inline" : "none"}}>Open Grimoire</GoToButton>
        <GoToButton settings={settings} to="/grim/create">New Grimoire</GoToButton>
        <GoToButton settings={settings} to="/settings">Settings</GoToButton>
        <GoToButton settings={settings} to="/credits">Credits</GoToButton>
    </div>
}