import { useState, type CSSProperties } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Settings from './pages/Settings';
import Credits from './pages/Credits';
import Grim from './pages/Grim';

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

    return <div className="main" style={{backgroundColor: backgroundColour, color: textColour}}>
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