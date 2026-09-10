import { useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Settings from './pages/Settings';
import Credits from './pages/Credits';
import Grim, { ScriptItem } from './pages/Grim';
import NewGrim, { GrimData } from './pages/NewGrim';
import CharacterSelect from './pages/CharacterSelect';
import NavBar from './templates/NavBar';
import { PlayerProperties } from './components/Player';

export type Settings = {
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
    const [initialTokenCircleRadius, setinitialTokenCircleRadius] = useState(190);
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


    const [scriptData, setScriptData] = useState<ScriptItem[]>([]);
    const scriptCharacters: string[] = scriptData.filter((scriptItem) => {
        return scriptItem.id != "_meta" //? Only keeps actual characters, not information about the script
    }).map((scriptItem) => {
        return scriptItem.id
    });
    // const [players, setPlayers] = useState<PlayerProperties[]>();
    const [players, setPlayers] = useState<PlayerProperties[]>([
        {character: "washerwoman", name: "Alice", x: 0, y: 0, isMenuOpen: false, reminders: [], isDead: false},
        {character: "librarian", name: "Bob", x: 0, y: 0, isMenuOpen: false, reminders: [], isDead: false},
        {character: "investigator", name: "Carol", x: 0, y: 0, isMenuOpen: false, reminders: [], isDead: false},
        {character: "poisoner", name: "David", x: 0, y: 0, isMenuOpen: false, reminders: [], isDead: false},
        {character: "imp", name: "Edith", x: 0, y: 0, isMenuOpen: false, reminders: [], isDead: false},
        {character: "ravenkeeper", name: "Freya", x: 0, y: 0, isMenuOpen: false, reminders: [], isDead: false},
        {character: "monk", name: "Gary", x: 0, y: 0, isMenuOpen: false, reminders: [], isDead: false},
        {character: "fortuneteller", name: "Hannah", x: 0, y: 0, isMenuOpen: false, reminders: [], isDead: false},
    ]); //DEBUG
    const [playercount, setPlayercount] = useState(-1);
    const [layout, setLayout] = useState("none");
    const [isGrimActive, setIsGrimActive] = useState(false);

    const grimData: GrimData = {
        scriptData: scriptData,
        scriptCharacters: scriptCharacters,
        setScriptData: setScriptData,

        players: players,
        setPlayers: setPlayers,

        playercount: playercount,
        setPlayercount: setPlayercount,
        layout: layout,
        setLayout: setLayout,

        isGrimActive: isGrimActive,
        setIsGrimActive: setIsGrimActive
    };

    return <div className="main" style={{backgroundColor: settings.backgroundColour, color: settings.textColour}}>
        <HashRouter>
            <Routes>
                <Route path="/*">
                    <Route index element={<Home settings={settings} grimData={grimData} />} />
                    <Route path="settings" element={<Settings settings={settings} />} />
                    <Route path="credits" element={<Credits settings={settings} />} />
                    <Route path="grim/*" element={<NavBar settings={settings} />}>
                        <Route index element={<Grim settings={settings} grimData={grimData} />} />
                        <Route path="create" element={<NewGrim settings={settings} grimData={grimData} />} />
                        <Route path="characterselect" element={<CharacterSelect settings={settings} grimData={grimData} />} />
                    </Route>
                </Route>
            </Routes>
        </HashRouter>
    </div>
}