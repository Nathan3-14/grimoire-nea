import { useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Settings, { setTheme } from './pages/Settings';
import Credits from './pages/Credits';
import Grim, { ScriptItem } from './pages/Grim';
import NewGrim, { GrimData } from './pages/NewGrim';
import CharacterSelect from './pages/CharacterSelect';
import NavBar from './templates/NavBar';
import { PlayerProperties } from './components/Player';

export type Settings = {
    colourTheme: string,
    setColourTheme: CallableFunction,

    backgroundColour: string,
    setBackgroundColour: CallableFunction,
    textColour: string,
    setTextColour: CallableFunction,
    linkColour: string,
    setLinkColour: CallableFunction,

    secondaryColour: string,
    setSecondaryColour: CallableFunction
    secondaryTextColour: string,
    setSecondaryTextColour: CallableFunction,

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
    const [colourTheme, setColourTheme] = useState("-1");
    const [backgroundColour, setBackgroundColour] = useState("-1");
    const [textColour, setTextColour] = useState("-1");
    const [linkColour, setLinkColour] = useState("-1")
    const [secondaryColour, setSecondaryColour] = useState("-1");
    const [secondaryTextColour, setSecondaryTextColour] = useState("-1");
    const [tokenSize, setTokenSize] = useState(100);
    const [tokenBackgroundColour, setTokenBackgroundColour] = useState("-1");
    const [tokenTextColour, setTokenTextColour] = useState("-1");
    const [initialTokenCircleRadius, setinitialTokenCircleRadius] = useState(190);
    const settings: Settings = {
        colourTheme: colourTheme,
        setColourTheme: setColourTheme,

        backgroundColour: backgroundColour,
        setBackgroundColour: setBackgroundColour,
        textColour: textColour,
        setTextColour: setTextColour,
        linkColour: linkColour,
        setLinkColour: setLinkColour,
        secondaryColour: secondaryColour,
        setSecondaryColour: setSecondaryColour,
        secondaryTextColour: secondaryTextColour,
        setSecondaryTextColour: setSecondaryTextColour,


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

    if (settings.colourTheme == "-1") {
        const newTheme = "darkred";
        setColourTheme(newTheme);
        setTheme(settings, newTheme);
    }


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