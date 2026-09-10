import { Settings } from "../App";
import { GrimData } from "./NewGrim";

export default function CharacterSelect({settings, grimData}: {settings: Settings, grimData: GrimData}) {
    return <h1 style={{backgroundColor: settings.secondaryColour}}>Select Characters layout: {grimData.layout}</h1>
}