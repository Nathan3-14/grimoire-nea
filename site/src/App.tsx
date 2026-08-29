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
    linkColour: string,
    setLinkColour: CallableFunction,

    tokenSize: number,
    halfTokenSize: number,
    setTokenSize: CallableFunction,
    reminderSize: number,
    halfReminderSize: number,

    tokenBackgroundColour: string,
    setTokenBackgroundColour: CallableFunction,
    tokenTextColour: string,
    setTokenTextColour: CallableFunction,

    initialTokenCircleRadius: number,
    setinitialTokenCircleRadius: CallableFunction,

    grimWidth: number,
    grimHeight: number
};

export default function App() {
    const [backgroundColour, setBackgroundColour] = useState("#2f4f4f");
    const [secondaryColour, setSecondaryColour] = useState("#1f4040");
    const [textColour, setTextColour] = useState("#ffffff");
    const [linkColour, setLinkColour] = useState("#88efe9")
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
        linkColour: linkColour,
        setLinkColour: setLinkColour,


        tokenSize: tokenSize,
        halfTokenSize: tokenSize * 0.5,
        setTokenSize: setTokenSize,
        reminderSize: 0.6 * tokenSize,
        halfReminderSize: 0.6 * tokenSize * 0.5,

        tokenBackgroundColour: tokenBackgroundColour,
        setTokenBackgroundColour: setTokenBackgroundColour,
        tokenTextColour: tokenTextColour,
        setTokenTextColour: setTokenTextColour,

        initialTokenCircleRadius: initialTokenCircleRadius, //? Radius of tokens when first placed
        setinitialTokenCircleRadius: setinitialTokenCircleRadius,

        grimWidth: 500,
        grimHeight: 500
    };

    return <div className="main" style={{backgroundColor: settings.backgroundColour, color: settings.textColour}}>
        <BrowserRouter>
            <Routes>
                <Route path="/*">
                    <Route index element={<Home settings={settings} />} />
                    <Route path="settings" element={<Settings settings={settings} />} />
                    <Route path="credits" element={<Credits settings={settings} />} />
                    <Route path="grim/*">
                        <Route index element={<Grim settings={settings} />} />
                        <Route path="create" element={<h1>New Grimoire Page</h1>} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>    
    </div>
}