import { Settings } from "../App";
import { characterTypes, getCharacterData } from "../funcs";
import { GrimData } from "../pages/NewGrim";
import Character from "./Character";

export default function CharacterSelectPane({settings, grimData, maxWidth}: {settings: Settings, grimData: GrimData, maxWidth?: number, justOne?: boolean}) {
    let characterChoices: {[characterType: string]: {offset: number, elements: React.JSX.Element[]}} = {
        "townsfolk": {offset: -1, elements: []},
        "outsider": {offset: -1, elements: []},
        "minion": {offset: -1, elements: []},
        "demon": {offset: -1, elements: []},
    }

    let nextOffset = 120; //* Distance of top line from top of page
    characterTypes.forEach((characterType) => {
        const charactersOfType = grimData.scriptCharacters.filter((characterID) => {return getCharacterData(characterID).team == characterType})

        characterChoices[characterType].elements = charactersOfType
            .map((characterID, index) => {                
                return <Character settings={settings} characterID={characterID} index={index} maxWidth={maxWidth}/>
        });
        characterChoices[characterType].offset = nextOffset;
        //? Adds 90 (a new line) and an additional new line per row of characters
        nextOffset += 90 + 90 * Math.floor(charactersOfType.length / (maxWidth ? maxWidth : 8));
    });

    return characterTypes.map((characterType) => {
        return <div
            className="character-choices" key={characterType} id={characterType}
            style={{top: characterChoices[characterType].offset}}
        >
            {characterChoices[characterType].elements}
        </div>
    })
}
