import { Settings } from "../App";
import { angleFromIndex, getCharacterData, getCharacterIconURL, getRandomItemFromList, setPlayer, shuffleList } from "../funcs";
import { GrimData } from "./NewGrim";
import "./CharacterSelect.css"
import Button from "../components/Button";
import { useState } from "react";
import { PlayerProperties } from "../components/Player";
import { useNavigate } from "react-router-dom";

export default function CharacterSelect({settings, grimData}: {settings: Settings, grimData: GrimData}) {
    const navigate = useNavigate();
    let characterChoices: {[characterType: string]: {offset: number, elements: React.JSX.Element[]}} = {
        "townsfolk": {offset: -1, elements: []},
        "outsider": {offset: -1, elements: []},
        "minion": {offset: -1, elements: []},
        "demon": {offset: -1, elements: []},
    }
    const characterTypes = ["townsfolk", "outsider", "minion", "demon"] as const; //? Means it will never change, like ever

    let nextOffset = 120; //* Distance of top line from top of page
    characterTypes.forEach((characterType) => {
        const charactersOfType = grimData.scriptCharacters.filter((characterID) => {return getCharacterData(characterID).team == characterType})

        characterChoices[characterType].elements = charactersOfType
            .map((characterID, index) => {
                const characterData = getCharacterData(characterID)
                const characterName = characterData.name;
                const characterType = characterData.team;
                const characterIcon = getCharacterIconURL(characterID);

                const [isSelected, setIsSelected] = useState(false);

                return <div
                    id={characterID}
                    key={characterID}
                    className={`character ${characterType} ${isSelected ? "selected": ""}`}
                    style={{
                        backgroundColor: settings.tokenBackgroundColour,
                        left: (index % 8) * 90,
                        top: Math.floor(index / 8) * 90,
                        boxShadow: isSelected ? `0 0 0 3px ${settings.textColour}` : ""
                    }}
                    onClick={() => {setIsSelected(!isSelected)}}
                >
                    <div className="overlay" style={{backgroundColor: `#ffffff${isSelected ? "00": "50"}`}} />
                    <svg xmlns="http://www.w3.org/2000/svg" width={75} height={75}>
                        <path id="name-path" fill="none" d="M22.5,7.5 A33,33 0 1 0 52.5,7.5" />
                        <text><textPath startOffset="50%" textAnchor="middle" href="#name-path" fill={settings.tokenTextColour}>{characterName}</textPath></text>
                    </svg>
                    <img src={characterIcon} width={75} />
        
                </div>
        });
        characterChoices[characterType].offset = nextOffset;
        //? Adds 90 (a new line) and an additional new line per row of characters
        nextOffset += 90 + 90 * Math.floor(charactersOfType.length / 8);
    });

    const handOutTokens = () => {
        const selectedCharacterElements = document.querySelectorAll(".selected");
        let selectedCharacterIDs: string[] = [];
        selectedCharacterElements.forEach((element) => {
            selectedCharacterIDs.push(element.id);
        });
        selectedCharacterIDs = shuffleList(selectedCharacterIDs);
        console.log(`Selected Characters: ${selectedCharacterIDs}`);

        let newPlayers: PlayerProperties[] = []
        for (let i=0; i<grimData.playercount; i++) {
            const character = selectedCharacterIDs.pop();
            if (character == null) continue;
            newPlayers.push({
                name: `Player ${i}`,
                character: character,
                reminders: [],
                x: settings.initialTokenCircleRadius * Math.sin(angleFromIndex(i, grimData.playercount)) - settings.halfTokenSize + (settings.grimHeight / 2),
                y: settings.initialTokenCircleRadius * Math.cos(angleFromIndex(i, grimData.playercount)) - settings.halfTokenSize + (settings.grimHeight / 2),
                isDead: false, isMenuOpen: false
            });
        }
        
        grimData.setPlayers(newPlayers);
        grimData.setIsGrimActive(true);
        navigate("/grim");

        // grimData.players.forEach((player, index) => {
        //     setPlayer(grimData, player.name, {
        //     });
        // });
    };

    return <div className="page character-select">
        <h1>Select Characters</h1>
        <div id="character-choices-wrapper">
            {characterTypes.map((characterType) => {
                return <div className="character-choices" key={characterType} id={characterType} style={{top: characterChoices[characterType].offset}}>{characterChoices[characterType].elements}</div>
            })}
        </div>
        <Button settings={settings} id="handout-tokens-button" onClick={() => handOutTokens()}>Hand out Tokens</Button>
    </div>
}