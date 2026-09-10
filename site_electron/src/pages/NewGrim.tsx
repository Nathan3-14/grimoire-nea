import { useState } from "react";
import { Settings } from "../App";
import "./NewGrim.css"
import { ScriptItem } from "./Grim";
import { PlayerProperties } from "../components/Player";
import { angleFromIndex, setPlayer } from "../funcs";
import troubleBrewing from "../data/trouble_brewing.json"
import badMoonRising from "../data/bad_moon_rising.json"
import sectsAndViolets from "../data/sects_and_violets.json"
import { useNavigate } from "react-router-dom";

export type GrimData = {
    scriptData: ScriptItem[],
    scriptCharacters: string[],
    setScriptData: (newValue: ScriptItem[]) => void,
    players: PlayerProperties[],
    setPlayers: (newValue: PlayerProperties[]) => void,
    playercount: number,
    setPlayercount: (newValue: number) => void,
    layout: string,
    setLayout: (newValue: string) => void,
    isGrimActive: boolean,
    setIsGrimActive: (newValue: boolean) => void
};

export default function NewGrim({settings, grimData}: {settings: Settings, grimData: GrimData}) {
    const [isCustomScriptSelected, setIsCustomScriptSelected] = useState(false);
    const handleSubmit = (formData: FormData) => {
        const script = formData.get("script");
        let scriptData: ScriptItem[] = [];
        if (script == "cus") {
            scriptData = [{"id": "_meta", "name": "custom"}]
        } else {
            switch (script) {
                case "tb":
                    scriptData = [...troubleBrewing, {"id": "_meta", "name": "Trouble Brewing", "author": "The Pandemonium Institute"}]
                    break;
                case "bmr":
                    scriptData = [...badMoonRising, {"id": "_meta", "name": "Bad Moon Rising", "author": "The Pandemonium Institute"}]
                    break;
                case "snv":
                    scriptData = [...sectsAndViolets, {"id": "_meta", "name": "Sects and Violets", "author": "The Pandemonium Institute"}]
                    break;
            }
        }
        const playercount = formData.get("playercount");
        const layout = formData.get("layout");

        if (playercount == null || layout == null) { //? This should never happen but it satisfied my linter so...
            return
        }
        
        grimData.setScriptData(scriptData);
        grimData.setPlayercount(+playercount);
        grimData.setLayout(layout.toString());

        grimData.players.forEach((player, index) => {
            setPlayer(grimData, player.name, {
                x: settings.initialTokenCircleRadius * Math.sin(angleFromIndex(index, grimData.players.length)) - settings.halfTokenSize + (settings.grimWidth / 2),
                y: settings.initialTokenCircleRadius * Math.cos(angleFromIndex(index, grimData.players.length)) - settings.halfTokenSize + (settings.grimHeight / 2)
            });
        })

        grimData.setIsGrimActive(true);

    }
    const navigate = useNavigate();

    return <div className="page">
        <h1>New Grim</h1>
        <form id="choices" action={handleSubmit} onSubmit={() => navigate("/grim")}>
            <div id="script-wrapper" style={{backgroundColor: settings.secondaryColour}}>
                <label htmlFor="script">SCRIPT</label>
                <select required name="script" id="script-select" style={{color: settings.textColour}} onChange={(e) => {setIsCustomScriptSelected(e.target.value == "cus" )}}> {/* //? allows a custom script url / file if corresponding option is selected */}
                    <option id="tb" value="tb">Trouble Brewing</option>
                    <option id="bmr" value="bmr">Bad Moon Rising</option>
                    <option id="snv" value="snv">Sects and Violets</option>
                    <option id="cus" value="cus">Custom</option>
                </select>
            </div>

            <div id="playercount-wrapper" style={{backgroundColor: settings.secondaryColour}}>
                <label htmlFor="playercount">PLAYER COUNT</label>
                <input required type="number" name="playercount" id="playercount-input" style={{color: settings.textColour, border: `1px solid ${settings.textColour}`}} placeholder="10" onChange={(e) => {
                    const field = e.target;
                    if (!/^\d+$/.test(field.value)) {field.setCustomValidity("Please enter a number")} //? RegEx (/.../) to check if the entire (^...$) string is 1 or more (+) digits (\d)
                    else if (+field.value > 20 || +field.value < 5) {field.setCustomValidity("Please enter a valid player count")}
                    else {field.setCustomValidity("")}
                    }}
                />
            </div>

            <div id="layout-wrapper" style={{backgroundColor: settings.secondaryColour}}>
                <label htmlFor="layout">LAYOUT</label>
                <select required name="layout" id="layout-select" style={{color: settings.textColour}}>
                    <option id="circle">Circle</option>
                    <option id="none">None</option>
                </select>
            </div>

            <div id="customscript-wrapper" style={{backgroundColor: settings.secondaryColour}}>
                <input type="url" id="customscript-url" disabled={!isCustomScriptSelected} placeholder="https://www.botcscripts.com/api/scripts/178/json/" />
                <input type="file" id="customscript-file" disabled={!isCustomScriptSelected} style={{color: settings.textColour}} />
            </div>

            <input
                type="submit"
                id="submit"
                value="Create Grim"
                style={{backgroundColor: settings.secondaryColour, color: settings.textColour, border: `1px solid ${settings.textColour}`}}
            />
        </form>
    </div>
}