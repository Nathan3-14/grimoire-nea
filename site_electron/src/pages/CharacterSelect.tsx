import { Settings } from "../App";
import { angleFromIndex, getCharacterData, shuffleList } from "../funcs";
import { GrimData } from "./NewGrim";
import "./CharacterSelect.css"
import Button from "../components/Button";
import { PlayerProperties } from "../components/Player";
import { useNavigate } from "react-router-dom";
import Character from "../components/Character";


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
                return <Character settings={settings} characterID={characterID} index={index} />
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