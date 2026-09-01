import convert from 'color-convert';
import type { Settings } from './App';

const TAU = 2 * Math.PI;
export const angleFromIndex = (index: number, max: number) => {
    return (index / max) * TAU + Math.PI;
}

export const goto = (address: string) => {
    console.log(window.location);
    console.log(window.location.href);
    console.log(address);
    window.location.href = address;
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