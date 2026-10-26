import { useNavigate } from "react-router-dom";
import { Settings } from "../App";
import { GrimData } from "./NewGrim";
import { useEffect, useState } from "react";

export default function ScriptSelect({settings, grimData}: {settings: Settings, grimData: GrimData}) {
    const navigate = useNavigate();

    useEffect(() => {
        console.log(`isready: ${grimData.isReadyForCharacterSelection}, id: ${grimData.scriptID}`);
        if (grimData.isReadyForCharacterSelection) {
            navigate("/grim/create/characterselect");
        } else if (grimData.scriptID != "cus") {
            navigate("/grim/create");
        }
    });

    const handleSubmit = (formData: FormData) => {
        if (isURLSelected) {
            const url = formData.get("customscript-url");
            if (!url) {return}
            fetch(url?.toString()).then((response) => {response.json().then((scriptArray) => {grimData.setScriptData(scriptArray)})}); //TODO Break down each component in document
        } else {
            const file = formData.get("customscript-file") as File;
            file.text().then((scriptString: string) => {grimData.setScriptData(JSON.parse(scriptString))});
        }
        

        grimData.setIsReadyForCharacterSelection(true);
    }

    const [isURLSelected, setIsURLSelected] = useState(true);
    
    return <div className="page script-select">
        <div>
            <label htmlFor="url">URL</label>
            <input defaultChecked type="radio" name="type-select" id="url" value="url" onChange={(e) => {setIsURLSelected(e.target.checked)}} /><br />
            <label htmlFor="file">Upload file</label>
            <input type="radio" name="type-select" id="file" value="file" onChange={(e) => {setIsURLSelected(!e.target.checked)}} /><br />
        </div>

        <form action={handleSubmit} onSubmit={() => navigate("/grim/create/characterselect")}>
            <input
                required={isURLSelected}
                // type="url" id="customscript-url" //DEBUG id is only needed for styling and querying
                type="url" name="customscript-url"
                placeholder="https://www.botcscripts.com/api/scripts/178/json/"
                disabled={!isURLSelected}
            /><br />
            <input
                required={!isURLSelected}
                type="file" name="customscript-file" id="customscript-file"
                accept=".json"
                style={{color: settings.textColour}}
                disabled={isURLSelected}
            /><br />

            <br />
            <input
                type="submit"
                value="Load Script"
            />
        </form>
    </div>
}