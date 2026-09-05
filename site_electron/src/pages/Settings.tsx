import type { Settings } from "../App"
import { hsl } from "../funcs";
import { useState } from "react";
import "./Settings.css"
import GoToButton from "../components/GoToButton";
import SettingsPreview from "../components/SettingsPreview";


export default function Settings({settings}: {settings: Settings}) {
    const [previewPlayerCount, setPreviewPlayerCount] = useState(7);

    return <div className="page">
        <h1>Settings</h1>
        <GoToButton to="/" settings={settings}>Home</GoToButton>

        <br />

        <label htmlFor="background-colour">Background Colour: </label>
        <input type="color" name="background-colour" value={settings.backgroundColour} onChange={(e) => {
            const colour = e.target.value;
            settings.setBackgroundColour(colour);
            settings.setTextColour(hsl(colour)[2] < 40 ? "#ffffff" : "#000000"); //? changes font colour if the background is too dark
            settings.setLinkColour(hsl(colour)[2] < 50 ? "#88efe9" : "#42928e")
        }} /> {/* sets "backgroundColour" whenever its value changes */}

        <br />

        <label htmlFor="secondary-colour">Secondary Colour: </label>
        <input type="color" name="secondary-colour" value={settings.secondaryColour} onChange={(e) => {
            settings.setSecondaryColour(e.target.value);
        }} />

        <br />

        <label htmlFor="token-size">Token Size: </label>
        <input type="number" name="token-size" value={settings.tokenSize} onChange={(e) => {
            settings.setTokenSize(e.target.value);
        }} />

        <br />

        <label htmlFor="token-circle-radius">Token Circle Radius: </label>
        <input type="number" name="token-circle-radius" value={settings.initialTokenCircleRadius} onChange={(e) => {
            settings.setinitialTokenCircleRadius(e.target.value);
        }} />

        <br />

        <label htmlFor="token-background-colour">Token Background Colour: </label>
        <input type="color" name="token-background-colour" value={settings.tokenBackgroundColour} onChange={(e) => {
            const colour = e.target.value;
            settings.setTokenBackgroundColour(colour);
            settings.setTokenTextColour(hsl(colour)[2] < 40 ? "#ffffff" : "#000000"); //? changes font colour if the background is too dark
        }} />

        <br /><br />
        

        <label htmlFor="player-count">Preview (half scale):<br />Player Count: </label>
        <input type="number" name="player-count" value={previewPlayerCount} onChange={(e) => {
            const playerCount = e.target.value;
            // +variable converts it to a number
            if (+playerCount < 5) {e.target.value = "5"}
            else if (+playerCount > 20) {e.target.value = "20"}

            setPreviewPlayerCount(+e.target.value);
        }}/>
        <SettingsPreview settings={settings} previewPlayerCount={previewPlayerCount} />
    </div>
}