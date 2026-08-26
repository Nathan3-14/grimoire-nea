import convert from 'color-convert';
import type { Settings } from './App';

const TAU = 2 * Math.PI;
export const angleFromIndex = (index: number, max: number) => {
    return (index / max) * TAU + Math.PI;
}

export const goto = (address: string) => {
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

//~~ Unused?????
// export const isInsideStage = (obj: Node, stage: Stage | null) => {
//     if (!stage) {return {"result": false, "direction": {"left": true, "right": true, "top": true, "bottom": true}}}
    
//     const objBound = obj.getClientRect();
//     console.log(`${objBound.x} -> ${objBound.x+objBound.width}`)
//     console.log(`${objBound.y} -> ${objBound.y+objBound.height}`)
//     console.log(`${0} -> ${stage.width()}`)
//     console.log(`${0} -> ${stage.height()}`)
//     const left = objBound.x >= 0;
//     const right = (objBound.x + objBound.width) <= stage.width();
//     const top = objBound.y >= 0;
//     const bottom = (objBound.y + objBound.height) <= stage.height();
//     return {
//         "result": (
//             left &&
//             right &&
//             top &&
//             bottom
//         ),
//         "direction": {
//             "left": !left,
//             "right": !right,
//             "top": !top,
//             "bottom": !bottom
//         }
//     };
// }

export const hsl = (colour: string) => {return convert.hex.hsl(colour)};

export const getCharacterIcon = (name: string) => {
    const filename = `${name.replace("_", "").replace("'", "").replace("-", "")}.png`;
    const url = `https://raw.githubusercontent.com/tomozbot/botc-icons/refs/heads/main/PNG/${filename}`;
    return url
}