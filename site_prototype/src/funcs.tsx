import convert from 'color-convert';
import {Md5} from 'ts-md5';
import type { Node } from 'konva/lib/Node';
import type { Stage } from 'konva/lib/Stage';

const TAU = 2 * Math.PI;
export const angleFromIndex = (index: number, max: number) => {
    return (index / max) * TAU + Math.PI;
}

export const isInsideStage = (obj: Node, stage: Stage) => {
    const objBound = obj.getClientRect();
    const containerBound = stage.getClientRect();
    console.log(`${objBound.x} -> ${objBound.x+objBound.width}`)
    console.log(`${objBound.y} -> ${objBound.y+objBound.height}`)
    console.log(`${containerBound.x} -> ${containerBound.x+stage.width()}`)
    console.log(`${containerBound.y} -> ${containerBound.y+stage.height()}`)
    return {
        "result": (
            objBound.x >= containerBound.x &&
            objBound.y >= containerBound.y &&
            (objBound.x + objBound.width) <= (containerBound.x + stage.width()) &&
            (objBound.y + objBound.height) <= (containerBound.y + stage.height())
        ),
        "direction": {
            "left": false,
            "right": false,
            "top": false,
            "bottom": false
        } //TODO Return direction where the collision is
    };
}

export const hsl = (colour: string) => {return convert.hex.hsl(colour)};

export const getCharacterIcon = (name: string) => {
    const filename = `Icon_${name.replace("_", "").replace("'", "").replace("-", "")}.png`;
    const result = Md5.hashStr(filename);
    const dirs = result.slice(0, 2);
    const dir_path = `${dirs[0]}/${dirs}`;
    const url = `https://wiki.bloodontheclocktower.com/images/${dir_path}/${filename}`
    return url
}