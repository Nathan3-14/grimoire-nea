import { Circle, Layer, Rect, Stage } from "react-konva";
import type { Settings } from "../App"
import { angleFromIndex, hsl } from "../funcs";
import { useState } from "react";
import "./Settings.css"

export default function Settings({settings}: {settings: Settings}) {
    const [previewPlayerCount, setPreviewPlayerCount] = useState(7);
    
    const examplePlayers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((_item, index) => {
        const halfTokenCircleRadius = settings.initialTokenCircleRadius / 2;
        const quarterTokenSize = settings.halfTokenSize / 2;
        return <Circle
            radius={quarterTokenSize}
            fill={settings.tokenBackgroundColour}
            x={halfTokenCircleRadius * Math.sin(angleFromIndex(index, previewPlayerCount)) + 125}
            y={halfTokenCircleRadius * Math.cos(angleFromIndex(index, previewPlayerCount)) + 125}
        />
    });

    return <>
        <label htmlFor="background-colour">Background Colour: </label>
        <input type="color" name="background-colour" value={settings.backgroundColour} onChange={(e) => {
            const colour = e.target.value;
            settings.setBackgroundColour(colour);
            settings.setTextColour(hsl(colour)[2] < 40 ? "#ffffff" : "#000000"); //changes font colour if the background is too dark
        }} /> {/* sets "backgroundColour" whenever its value changes */}

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

        <label htmlFor="background-colour">Token Background Colour: </label>
        <input type="color" name="background-colour" value={settings.tokenBackgroundColour} onChange={(e) => {
            const colour = e.target.value;
            settings.setTokenBackgroundColour(colour);
            settings.setTokenTextColour(hsl(colour)[2] < 40 ? "#ffffff" : "#000000");
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
        <br />
        <Stage width={250} height={250}>
            <Layer id="background"><Rect fill={settings.backgroundColour} width={250} height={250} stroke={settings.textColour} strokeWidth={2.5} /></Layer>
            <Layer id="tokens">
                {examplePlayers}
            </Layer>
        </Stage>
    </>
}