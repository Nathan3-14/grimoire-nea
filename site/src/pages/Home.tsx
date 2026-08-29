import type { Settings } from "../App"
import {goto} from "../funcs"
import Button from "../components/Button"
import "./Home.css"

export default function Home({settings}: {settings: Settings}) {
    return <>
        <h1>Grimoire</h1>
        <p>The current Character Art is temporary and <span className="emph">will not be used</span> in final project due to usage restrictions on the official images (the ones shown).</p>
        <Button onClick={() => {goto("/grim")}} settings={settings}>New Grimoire</Button>
        <Button onClick={() => {goto("/settings")}} settings={settings}>Settings</Button>
        <Button onClick={() => {goto("/credits")}} settings={settings}>Credits</Button>
    </>
}