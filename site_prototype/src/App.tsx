import { useEffect, useState } from 'react'
import convert from "color-convert";
import './App.css'

export default function App() {
    const [backgroundColour, setBackgroundColour] = useState("#2f4f4f")
    
    //? Background Colour Change Handler
    useEffect(() => {
        const backgroundColorHSL = convert.hex.hsl(backgroundColour)
        document.body.style.backgroundColor = backgroundColour;
        document.body.style.color = backgroundColorHSL[2] < 40 ? "white" : "black"; //changes font colour if the background is too dark
    }, backgroundColour); //only runs when "backgroundColour" updates

    return <>
        <h1>Grimoire</h1>

        <input type="color" value={backgroundColour} onChange={(e) => setBackgroundColour(e.target.value)} /> {/* sets "backgroundColour" whenever its value changes */}
    </>
}
