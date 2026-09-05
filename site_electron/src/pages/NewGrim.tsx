import { Settings } from "../App";
import "./NewGrim.css"

export default function NewGrim({settings}: {settings: Settings}) {
    return <div className="page">
        <h1>New Grim</h1>
        <form id="choices">
            <div className="select-wrapper" id="script-wrapper" style={{backgroundColor: settings.secondaryColour}}>
                <label htmlFor="script">SCRIPT</label>
                <select name="script" id="script-select" style={{color: settings.textColour}}>
                    <option id="tb">Trouble Brewing</option>
                    <option id="bmr">Bad Moon Rising</option>
                    <option id="snv">Sects and Violets</option>
                    <option id="cus">Custom</option>
                </select>
            </div>
            <div id="playercount-wrapper" style={{backgroundColor: settings.secondaryColour}}>
                <label htmlFor="playercount">PLAYER COUNT</label>
                <input type="number" id="playercount-input" style={{color: settings.textColour, border: `1px solid ${settings.textColour}`}} onChange={(e) => {
                    const field = e.target;
                    if (!/^\d+$/.test(field.value)) {field.setCustomValidity("Please enter a number")} //? RegEx (/.../) for if it is a string of 1 or more (+) digits (\d)
                    else if (+field.value > 20 || +field.value < 5) {field.setCustomValidity("Please enter a valid player count")}
                    else {field.setCustomValidity("")}
                    }}
                />
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