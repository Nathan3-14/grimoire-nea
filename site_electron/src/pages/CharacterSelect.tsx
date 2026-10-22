import { Settings } from "../App";
import { getCharacterData, getCharacterIconURL } from "../funcs";
import { GrimData } from "./NewGrim";
import "./CharacterSelect.css"

export default function CharacterSelect({settings, grimData}: {settings: Settings, grimData: GrimData}) {
    const characterChoices = grimData.scriptCharacters.map((characterID) => {
        const characterData = getCharacterData(characterID)
        const characterName = characterData.name;
        const characterType = characterData.team;
        const characterIcon = getCharacterIconURL(characterID);

        return <div key={characterID} className={`character ${characterType}`}>

            <svg xmlns="http://www.w3.org/2000/svg">
                <path id="name-path" fill="none" d="M22.5,7.5 A33,33 0 1 0 52.5,7.5" />
                <text>
                    <textPath href="#name-path">{characterName}</textPath>
                </text>
            </svg>
            <img src={characterIcon} width={75} />

        </div>
    });

    return <div className="page character-select">
        <h1>Select Characters</h1>
        <div id="character-choices">
            {characterChoices}
        </div>
    </div>
}