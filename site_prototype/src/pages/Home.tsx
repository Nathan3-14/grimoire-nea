import type { Settings } from "../App"
import Button from "../components/Button"
import "./Home.css"

export default function Home({settings}: {settings: Settings}) {
    return <>
        <h1>Grimoire</h1>
        <Button settings={settings}>New Grimoire</Button>
        <Button settings={settings}>Settings</Button>
        <Button settings={settings}>Credits</Button>
    </>
}