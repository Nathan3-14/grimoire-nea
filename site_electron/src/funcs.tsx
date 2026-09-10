import convert from 'color-convert';
import type { Settings } from './App';
import { GrimData } from './pages/NewGrim';
import { NewPlayerProperties, PlayerProperties } from './components/Player';

const TAU = 2 * Math.PI;
export const angleFromIndex = (index: number, max: number) => {
    return (index / max) * TAU + Math.PI;
}

export const checkCircleInsideGrim = (
    position: {x: number, y: number},
    diameter: number,
    settings: Settings,
    results: {
        left: CallableFunction,
        right: CallableFunction,
        top: CallableFunction,
        bottom: CallableFunction
    }
) => {
    if (position.x < 0) {results.left()}
    if (position.y < 0) {results.top()}
    if ((position.x + diameter) > settings.grimWidth) {results.right()}
    if ((position.y + diameter) > settings.grimHeight) {results.bottom()}
}

export const hsl = (colour: string) => {return convert.hex.hsl(colour)};

export const getCharacterIcon = (name: string) => {
    const filename = `${name.replace("_", "").replace("'", "").replace("-", "")}.png`;
    const url = `https://raw.githubusercontent.com/tomozbot/botc-icons/refs/heads/main/PNG/${filename}`;
    return url
}

//! Update when new properties are added
export const setPlayer = (grimData: GrimData, name: string|undefined, properties: NewPlayerProperties) => {
    if (!name) {return}

    const newPlayers: PlayerProperties[] = []; 
    grimData.players.forEach((player) => {
        const tempPlayer = player;
        if (player.name == name) {
            console.log(`Settings ${properties} for ${name}`);
            if (properties.character) {tempPlayer.character = properties.character}
            if (properties.name) {tempPlayer.name = properties.name}
            if (properties.x) {tempPlayer.x = properties.x}
            if (properties.y) {tempPlayer.y = properties.y}
            if (properties.isMenuOpen !== undefined) {tempPlayer.isMenuOpen = properties.isMenuOpen}
            if (properties.reminders) {tempPlayer.reminders = properties.reminders}
            if (properties.isDead !== undefined)  {tempPlayer.isDead = properties.isDead}
        }
        newPlayers.push(tempPlayer);
    });
    grimData.setPlayers(newPlayers);
};
