import { MouseEvent, useState } from "react";
import { Settings } from "../App";
import { getCharacterData, getCharacterIconURL } from "../funcs";

export default function Character({settings, characterID, index, maxWidth, effect}: {settings: Settings, characterID: string, index: number, maxWidth?: number, effect?: (e: MouseEvent) => void}) {
    const [isSelected, setIsSelected] = useState(false);

    const characterData = getCharacterData(characterID)
    const characterName = characterData.name;
    const characterType = characterData.team;
    const characterIcon = getCharacterIconURL(characterID);

    return <div
        id={characterID}
        key={characterID}
        className={`character ${characterType} ${isSelected ? "selected": ""}`}
        style={{
            backgroundColor: settings.tokenBackgroundColour,
            left: (index % (maxWidth ? maxWidth : 8)) * 90,
            top: Math.floor(index / (maxWidth ? maxWidth : 8)) * 90,
            boxShadow: isSelected ? `0 0 0 3px ${settings.textColour}` : ""
        }}
        onClick={effect ? effect : () => {setIsSelected(!isSelected)}}
    >
        <div className="overlay" style={{backgroundColor: `#ffffff${isSelected ? "00": "50"}`}} />
        <svg xmlns="http://www.w3.org/2000/svg" width={75} height={75}>
            <path id="name-path" fill="none" d="M22.5,7.5 A33,33 0 1 0 52.5,7.5" />
            <text><textPath startOffset="50%" textAnchor="middle" href="#name-path" fill={settings.tokenTextColour}>{characterName}</textPath></text>
        </svg>
        <img src={characterIcon} width={75} />

    </div>
}