import { Settings } from "../App";
import { angleFromIndex, shuffleList } from "../funcs";
import { GrimData } from "./NewGrim";
import "./CharacterSelect.css"
import Button from "../components/Button";
import { PlayerProperties } from "../components/Player";
import { useNavigate } from "react-router-dom";
import CharacterSelectPane from "../components/CharacterSelectPane";


export default function CharacterSelect({settings, grimData}: {settings: Settings, grimData: GrimData}) {
    const navigate = useNavigate();
    
    const handOutTokens = () => {
        const selectedCharacterElements = document.querySelectorAll(".selected");
        if (selectedCharacterElements.length != grimData.playercount) {
            return
        }

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
            <CharacterSelectPane settings={settings} grimData={grimData} top={140} />
        </div>
        <Button settings={settings} id="handout-tokens-button" onClick={() => handOutTokens()}>Hand out Tokens</Button>
        <p style={{backgroundColor: settings.secondaryColour, color: settings.secondaryTextColour}}>Please select the correct number of characters ({grimData.playercount})</p>
        {/* //TODO show/hide the above text based on condition */}
    </div>
}