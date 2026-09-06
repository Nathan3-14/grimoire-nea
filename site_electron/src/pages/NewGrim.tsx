import { useState } from "react";
import { Settings } from "../App";
import "./NewGrim.css"

export default function NewGrim({settings}: {settings: Settings}) {
    const [isCustomScriptSelected, setIsCustomScriptSelected] = useState(false);

    return <div className="page">
        <h1>New Grim</h1>
        <form id="choices">
            <div className="select-wrapper" id="script-wrapper" style={{backgroundColor: settings.secondaryColour}}>
                <label htmlFor="script">SCRIPT</label>
                <select name="script" id="script-select" style={{color: settings.textColour}} onChange={(e) => {setIsCustomScriptSelected(e.target.value == "cus" )}}> {/* //? allows a custom script url / file if corresponding option is selected */}
                    <option id="tb" value="tb">Trouble Brewing</option>
                    <option id="bmr" value="bmr">Bad Moon Rising</option>
                    <option id="snv" value="snv">Sects and Violets</option>
                    <option id="cus" value="cus">Custom</option>
                </select>
            </div>

            <div id="playercount-wrapper" style={{backgroundColor: settings.secondaryColour}}>
                <label htmlFor="playercount">PLAYER COUNT</label>
                <input type="number" id="playercount-input" style={{color: settings.textColour, border: `1px solid ${settings.textColour}`}} value="10" onChange={(e) => {
                    const field = e.target;
                    if (!/^\d+$/.test(field.value)) {field.setCustomValidity("Please enter a number")} //? RegEx (/.../) for if it is a string of 1 or more (+) digits (\d)
                    else if (+field.value > 20 || +field.value < 5) {field.setCustomValidity("Please enter a valid player count")}
                    else {field.setCustomValidity("")}
                    }}
                />
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