import type { Settings } from "../App"
import { useState } from "react";
import "./Settings.css"
import GoToButton from "../components/GoToButton";
import SettingsPreview from "../components/SettingsPreview";
import { DarkRed, LightBlue, Pine, Purple, Theme } from "../data/Themes";

const themes: {[name: string]: Theme} = {
    "pine": Pine,
    "lightblue": LightBlue,
    "darkred": DarkRed,
    "purple": Purple
}

export const setTheme = (settings: Settings, theme: string) => {
    settings.setColourTheme(theme);
    if (theme == "custom") return

    const currentTheme = themes[theme];

    settings.setBackgroundColour(currentTheme.backgroundColour);
    settings.setTextColour(currentTheme.textColour);
    settings.setLinkColour(currentTheme.linkColour);

    settings.setSecondaryColour(currentTheme.secondaryColour);
    settings.setSecondaryTextColour(currentTheme.secondaryTextColour);

    settings.setTokenBackgroundColour(currentTheme.tokenBackgroundColour);
    settings.setTokenTextColour(currentTheme.tokenTextColour);
}

export default function Settings({settings}: {settings: Settings}) {
    const [previewPlayerCount, setPreviewPlayerCount] = useState(7);

    return <div className="page settings">
        <div id="header-wrapper">
            <h1>Settings</h1>
            <GoToButton to="/" settings={settings}>Home</GoToButton>
        </div>

        <div id="settings-wrapper">
            <div id="theme-wrapper" style={{backgroundColor: settings.secondaryColour}}>
                <label htmlFor="theme">THEME</label>
                <select name="theme" id="theme-select" value={settings.colourTheme} style={{color: settings.textColour}} onChange={(e) => {
                    setTheme(settings, e.target.value);
                }}>
                    <option id="darkred" value="darkred">Dark Red (default)</option>
                    <option id="pine" value="pine">Pine</option>
                    <option id="lightblue" value="lightblue">Light Blue</option>
                    <option id="purple" value="purple">Purple</option>
                    <option id="custom" value="custom">Custom</option>
                </select>
            </div>

            <br />

            <label htmlFor="background-colour">Background Colour: </label>
            <input disabled={settings.colourTheme != "custom"} type="color" name="background-colour" value={settings.backgroundColour} onChange={(e) => {
                settings.setBackgroundColour(e.target.value);
            }} /> {/* sets "backgroundColour" whenever its value changes */}

            <br />

            <label htmlFor="text-colour">Text Colour: </label>
            <input disabled={settings.colourTheme != "custom"} type="color" name="text-colour" value={settings.textColour} onChange={(e) => {
                settings.setTextColour(e.target.value);
            }} />

            <br />

            <label htmlFor="secondary-colour">Secondary Colour: </label>
            <input disabled={settings.colourTheme != "custom"} type="color" name="secondary-colour" value={settings.secondaryColour} onChange={(e) => {
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
            <input disabled={settings.colourTheme != "custom"} type="color" name="token-background-colour" value={settings.tokenBackgroundColour} onChange={(e) => {
                settings.setTokenBackgroundColour(e.target.value);
            }} />
        </div>

        <div id="preview-wrapper">
            <br />
            <label htmlFor="player-count"><br />Preview (half scale):<br />Player Count: </label> {/* Extra <br /> is needed to align text */}
            <input type="number" name="player-count" value={previewPlayerCount} onChange={(e) => {
                const playerCount = e.target.value;
                // +variable converts it to a number
                if (+playerCount < 5) {e.target.value = "5"}
                else if (+playerCount > 20) {e.target.value = "20"}

                setPreviewPlayerCount(+e.target.value);
            }}/>
            <SettingsPreview settings={settings} previewPlayerCount={previewPlayerCount} />
        </div>

    </div>
}