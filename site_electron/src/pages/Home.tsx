import type { Settings } from "../App"
import GoToButton from "../components/GoToButton"
import "./Home.css"

export default function Home({settings}: {settings: Settings}) {
    return <>
        <h1>Grimoire</h1>
        <p>The current Character Art is temporary and <span className="emph">will not be used</span> in final project due to usage restrictions on the official images (the ones shown).</p>
        <GoToButton settings={settings} to="/grim">Open Grimoire</GoToButton>
        <GoToButton settings={settings} to="/grim/create">New Grimoire</GoToButton>
        <GoToButton settings={settings} to="/settings">Settings</GoToButton>
        <GoToButton settings={settings} to="/credits">Credits</GoToButton>
    </>
}