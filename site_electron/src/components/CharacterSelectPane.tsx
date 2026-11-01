import { MouseEvent } from "react";
import { Settings } from "../App";
import { characterTypes, getCharacterData } from "../funcs";
import { GrimData } from "../pages/NewGrim";
import Character from "./Character";
import "./CharacterSelectPane.css";

export default function CharacterSelectPane({settings, grimData, maxWidth, scale, top, effect}: {settings: Settings, grimData: GrimData, maxWidth?: number, effect?: (e: MouseEvent) => void, scale?: number, top: number}) {
    scale = scale ? scale : 1;
    let characterChoices: {[characterType: string]: {offset: number, elements: React.JSX.Element[]}} = {
        "townsfolk": {offset: -1, elements: []},
        "outsider": {offset: -1, elements: []},
        "minion": {offset: -1, elements: []},
        "demon": {offset: -1, elements: []},
    }

    let nextOffset = top; //* Distance of top line from top of page
    characterTypes.forEach((characterType) => {
        const charactersOfType = grimData.scriptCharacters.filter((characterID) => {return getCharacterData(characterID).team == characterType})

        characterChoices[characterType].elements = charactersOfType
            .map((characterID, index) => {                
                return <Character
                    settings={settings}
                    key={characterID}
                    characterID={characterID} index={index}
                    maxWidth={maxWidth}
                    effect={effect}
                />
        });
        characterChoices[characterType].offset = nextOffset;
        nextOffset += (90*scale) * (Math.floor(charactersOfType.length / (maxWidth ? maxWidth : 8)) + 1);
    });

    return characterTypes.map((characterType) => {
        return <div
            className="character-choices" key={characterType} id={characterType}
            style={{top: characterChoices[characterType].offset, scale: scale}}
        >
            {characterChoices[characterType].elements}
        </div>
    })
}
