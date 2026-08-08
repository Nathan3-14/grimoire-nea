import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Settings from './pages/Settings';
import Credits from './pages/Credits';
import Grim from './pages/Grim';

export interface Settings {
    backgroundColour: string,
    setBackgroundColour: CallableFunction,
    secondaryColour: string,
    setSecondaryColour: CallableFunction
    textColour: string,
    setTextColour: CallableFunction,

    tokenSize: number,
    halfTokenSize: number,
    setTokenSize: CallableFunction,

    tokenBackgroundColour: string,
    setTokenBackgroundColour: CallableFunction,
    tokenTextColour: string,
    setTokenTextColour: CallableFunction,

    initialTokenCircleRadius: number,
    setinitialTokenCircleRadius: CallableFunction
};

export default function App() {
    const [backgroundColour, setBackgroundColour] = useState("#2f4f4f");
    const [secondaryColour, setSecondaryColour] = useState("#1f4040");
    const [textColour, setTextColour] = useState("#ffffff");
    const [tokenSize, setTokenSize] = useState(100);
    const [tokenBackgroundColour, setTokenBackgroundColour] = useState("#3a7e7e");
    const [tokenTextColour, setTokenTextColour] = useState("#ffffff");
    const [initialTokenCircleRadius, setinitialTokenCircleRadius] = useState(200);
    const settings: Settings = {
        backgroundColour: backgroundColour,
        setBackgroundColour: setBackgroundColour,
        secondaryColour: secondaryColour,
        setSecondaryColour: setSecondaryColour,
        textColour: textColour,
        setTextColour: setTextColour,


        tokenSize: tokenSize,
        halfTokenSize: Math.floor(tokenSize / 2),
        setTokenSize: setTokenSize,

        tokenBackgroundColour: tokenBackgroundColour,
        setTokenBackgroundColour: setTokenBackgroundColour,
        tokenTextColour: tokenTextColour,
        setTokenTextColour: setTokenTextColour,

        initialTokenCircleRadius: initialTokenCircleRadius, //? Radius of tokens when first placed
        setinitialTokenCircleRadius: setinitialTokenCircleRadius
    };

    // return <div className="main" style={{backgroundColor: "lightslategrey"}}>
    return <div className="main" style={{backgroundColor: settings.backgroundColour, color: settings.textColour}}>
        <BrowserRouter>
            <Routes>
                <Route path="" element={<Home settings={settings} />} />
                <Route path="/settings" element={<Settings settings={settings} />} />
                <Route path="/credits" element={<Credits settings={settings} />} />
                <Route path="/grim" element={<Grim settings={settings} />} />
                <Route path="/grim/create" element={<h1>New Grimoire Page</h1>} />
            </Routes>
        </BrowserRouter>    
    </div>
}