import { Settings } from "../App";
import { GrimData } from "./NewGrim";
import botcRoles from "../data/botc_roles.json";

export default function CharacterSelect({settings, grimData}: {settings: Settings, grimData: GrimData}) {
    const characterChoices = grimData.scriptCharacters.map((value) => {name: value, characterType: }); //TODO Create function to get character data in general in funcs.tsx with custom type and use .townsfolk here

    return <>
        <h1 style={{backgroundColor: settings.secondaryColour}}>Select Characters</h1>
    </>
}