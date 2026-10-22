import { Settings } from "../App";
import { getCharacterData, getCharacterIconURL } from "../funcs";
import { GrimData } from "./NewGrim";
import "./CharacterSelect.css"

export default function CharacterSelect({settings, grimData}: {settings: Settings, grimData: GrimData}) {
    const typeToOffset: {[characterType: string]: number} = {
        "townsfolk": 0,
        "outsider": 1,
        "minion": 2,
        "demon": 3,
        "traveller": 4
    }

    const characterChoices = grimData.scriptCharacters.map((characterID) => {
        const characterData = getCharacterData(characterID)
        const characterName = characterData.name;
        const characterType = characterData.team;
        const characterIcon = getCharacterIconURL(characterID);

        return <div key={characterID} className={`character ${characterType}`} about={characterType} style={{backgroundColor: settings.tokenBackgroundColour}}>

            <svg xmlns="http://www.w3.org/2000/svg" width={75} height={75}>
                <path id="name-path" fill="none" d="M22.5,7.5 A33,33 0 1 0 52.5,7.5" />
                <text><textPath startOffset="50%" textAnchor="middle" href="#name-path" fill={settings.tokenTextColour}>{characterName}</textPath></text>
            </svg>
            <img src={characterIcon} width={75} />

        </div>
    });

    return <div className="page character-select">
        <h1>Select Characters</h1>
        <div id="character-choices">
            {characterChoices.filter((value) => {return value.props["about"] == "townsfolk"}).map((value, index) => {
                const movedItem = value;
                movedItem.props["left"] = index * 90;
                movedItem.props["top"] = 0;
                return movedItem //TODO Make this work
                //TODO put this in a foreach loop over [townsfolk, outsider, minion, demon] and replace value.props["about"] == ... with it
            })}
        </div>
    </div>
}