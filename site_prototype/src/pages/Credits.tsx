import type { Settings } from "../App";
import Button from "../components/Button";
import { goto } from "../funcs";
import "./Credits.css"

export default function Credits({settings}: {settings: Settings}) {
    return <>
        <h1>Credits</h1>
        <Button onClick={() => goto("/")} settings={settings}>Home</Button>
    
        <br />
        <div className="credits-list">
            <p>This application is not affiliated with The Pandemonium Institute.<br />All roles and characters are the property of Steven Medway and The Pandemonium Institute.<br />Blood on the Clocktower is a trademark of Steven Medway and The Pandemonium Institute.</p>
            {/* <p>Character Icons are from Tomozbot's botc-icons on <a href="https://www.github.com/tomozbot/botc-icons/">Github</a>.</p> */}
            <p>Papyrus and Old English Text MT fonts as provided by <a href="https://www.online-fonts.com">online-fonts.com</a></p>
            <p>Fredoka font provided by <a href="https://fonts.google.com/">Google Fonts</a></p>
        </div>
    </>
}