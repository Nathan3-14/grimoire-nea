import convert from 'color-convert';

export const hsl = (colour: string) => {return convert.hex.hsl(colour)};