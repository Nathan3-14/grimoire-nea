import type { Settings } from "../App"
import { hsl } from "../funcs";

export default function Settings({settings}: {settings: Settings}) {
    return <>
        <label htmlFor="background-colour">Background Colour: </label>
        <input type="color" name="background-colour" value={settings.backgroundColour} onChange={(e) => {
            const colour = e.target.value;
            settings.setBackgroundColour(e.target.value);
            settings.setTextColour(hsl(colour)[2] < 40 ? "#ffffff" : "#000000"); //changes font colour if the background is too dark
        }} /> {/* sets "backgroundColour" whenever its value changes */}
    </>
}