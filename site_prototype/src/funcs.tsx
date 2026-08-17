import convert from 'color-convert';
import {Md5} from 'ts-md5';
import type { Node } from 'konva/lib/Node';
import type { Stage } from 'konva/lib/Stage';

const TAU = 2 * Math.PI;
export const angleFromIndex = (index: number, max: number) => {
    return (index / max) * TAU + Math.PI;
}

export const goto = (address: string) => {
    window.location.href = address;
}

export const isInsideStage = (obj: Node, stage: Stage | null) => {
    if (!stage) {return {"result": false, "direction": {"left": true, "right": true, "top": true, "bottom": true}}}
    
    const objBound = obj.getClientRect();
    console.log(`${objBound.x} -> ${objBound.x+objBound.width}`)
    console.log(`${objBound.y} -> ${objBound.y+objBound.height}`)
    console.log(`${0} -> ${stage.width()}`)
    console.log(`${0} -> ${stage.height()}`)
    const left = objBound.x >= 0;
    const right = (objBound.x + objBound.width) <= stage.width();
    const top = objBound.y >= 0;
    const bottom = (objBound.y + objBound.height) <= stage.height();
    return {
        "result": (
            left &&
            right &&
            top &&
            bottom
        ),
        "direction": {
            "left": !left,
            "right": !right,
            "top": !top,
            "bottom": !bottom
        }
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