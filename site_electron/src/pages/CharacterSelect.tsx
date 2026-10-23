import { Settings } from "../App";
import { getCharacterData, getCharacterIconURL } from "../funcs";
import { GrimData } from "./NewGrim";
import "./CharacterSelect.css"

export default function CharacterSelect({settings, grimData}: {settings: Settings, grimData: GrimData}) {
    let characterChoices: {[characterType: string]: {offset: number, elements: React.JSX.Element[]}} = {
        "townsfolk": {offset: -1, elements: []},
        "outsider": {offset: -1, elements: []},
        "minion": {offset: -1, elements: []},
        "demon": {offset: -1, elements: []},
        "traveller": {offset: -1, elements: []}
    }
    const characterTypes = ["townsfolk", "outsider", "minion", "demon", "traveller"];

    let nextOffset = 90;
    characterTypes.forEach((characterType) => {
        const charactersOfType = grimData.scriptCharacters.filter((characterID) => {return getCharacterData(characterID).team == characterType})

        characterChoices[characterType].elements = charactersOfType
            .map((characterID, index) => {
                const characterData = getCharacterData(characterID)
                const characterName = characterData.name;
                const characterType = characterData.team;
                const characterIcon = getCharacterIconURL(characterID);

                return <div key={characterID} className={`character ${characterType}`} style={{backgroundColor: settings.tokenBackgroundColour, left: (index % 8) * 90, top: Math.floor(index / 8) * 90}}>
        
                    <svg xmlns="http://www.w3.org/2000/svg" width={75} height={75}>
                        <path id="name-path" fill="none" d="M22.5,7.5 A33,33 0 1 0 52.5,7.5" />
                        <text><textPath startOffset="50%" textAnchor="middle" href="#name-path" fill={settings.tokenTextColour}>{characterName}</textPath></text>
                    </svg>
                    <img src={characterIcon} width={75} />
        
                </div>
        });
        characterChoices[characterType].offset = nextOffset;
        nextOffset += 90 + 90 * Math.floor(charactersOfType.length / 8);
    });

    return <div className="page character-select">
        <h1>Select Characters</h1>
        <div id="character-choices-wrapper">
            {characterTypes.map((characterType) => {
                return <div className="character-choices" key={characterType} id={characterType} style={{top: characterChoices[characterType].offset}}>{characterChoices[characterType].elements}</div>
            })}
        </div>
    </div>
}