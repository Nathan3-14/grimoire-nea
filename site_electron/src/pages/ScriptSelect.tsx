import { useNavigate } from "react-router-dom";
import { Settings } from "../App";
import GoToButton from "../components/GoToButton";
import { GrimData } from "./NewGrim";
import { useEffect, useState } from "react";

export default function ScriptSelect({settings, grimData}: {settings: Settings, grimData: GrimData}) {
    const navigate = useNavigate();

    useEffect(() => {
        console.log(grimData.isGrimActive);
        if (grimData.isGrimActive) {
            navigate("/grim/create/characterselect");
        } //TODO Make navigate(-1) work here, potentially set a state in grimData
    });

    const handleSubmit = (formData: FormData) => {
        //TODO load script data like in newgrim and go to character seleet
        //TODOD set is grim active as well, or maybe not, potentially add more states?
    }

    const [isURLSelected, setIsURLSelected] = useState(true);

    
    return <div>
        <form action={handleSubmit} onSubmit={() => navigate("/grim/create/characterselect")}>
            <label htmlFor="url">URL</label>
            <input checked={true} type="radio" name="type-select" id="url" value="url" onChange={(e) => {setIsURLSelected(e.target.checked)}} /><br />
            <label htmlFor="file">Upload file</label>
            <input type="radio" name="type-select" id="file" value="file" onChange={(e) => {setIsURLSelected(!e.target.checked)}} /><br />

            <input
                type="url" id="customscript-url"
                placeholder="https://www.botcscripts.com/api/scripts/178/json/"
                disabled={!isURLSelected} //TODO Add setcustomvalidity to both of these
            /><br />
            <input
                type="file" id="customscript-file"
                style={{color: settings.textColour}}
                disabled={isURLSelected}
            />
        </form>
    </div>
}