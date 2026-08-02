import convert from 'color-convert';
import {Md5} from 'ts-md5';

export const hsl = (colour: string) => {return convert.hex.hsl(colour)};

export const getCharacterIcon = (name: string) => {
    const filename = `Icon_${name.replace("_", "").replace("'", "").replace("-", "")}.png`;
    const result = Md5.hashStr(filename);
    const dirs = result.slice(0, 2);
    const dir_path = `${dirs[0]}/${dirs}`;
    const url = `https://wiki.bloodontheclocktower.com/images/${dir_path}/${filename}`
    return url
}