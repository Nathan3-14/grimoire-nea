import { useState, type CSSProperties } from 'react'
import './App.css'
import Home from './pages/Home'
import Settings from './pages/Settings';
import Credits from './pages/Credits';

export interface Settings {
    backgroundColour: string,
    setBackgroundColour: CallableFunction,
    textColour: string,
    setTextColour: CallableFunction
};

export default function App() {
    const [backgroundColour, setBackgroundColour] = useState("#2f4f4f");
    const [textColour, setTextColour] = useState("#ffffff");
    const settings: Settings = {
        backgroundColour: backgroundColour,
        setBackgroundColour: setBackgroundColour,
        textColour: textColour,
        setTextColour: setTextColour
    };
    
    return <div className="main" style={{backgroundColor: backgroundColour, color: textColour, '--col': textColour} as CSSProperties}>
        {/* <Home settings={settings} />
        <Settings settings={settings} /> */}
        <Credits settings={settings} />
    </div>
}