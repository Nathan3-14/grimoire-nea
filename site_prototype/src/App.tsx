import { useEffect, useState } from 'react'
import './App.css'
import Home from './pages/Home'
import convert from 'color-convert';
import Settings from './pages/Settings';

export default function App() {
    const [backgroundColour, setBackgroundColour] = useState("#2f4f4f");

    //? Background Colour Change Handler
    useEffect(() => {
            const backgroundColorHSL = convert.hex.hsl(backgroundColour)
            document.body.style.backgroundColor = backgroundColour;
            document.body.style.color = backgroundColorHSL[2] < 40 ? "white" : "black"; //changes font colour if the background is too dark
    }, backgroundColour); //only runs when "backgroundColour" updates
    
    return <>
        {/* <Home /> */}
        <Settings backgroundColour={backgroundColour} setBackgroundColour={setBackgroundColour} />
    </>
}
