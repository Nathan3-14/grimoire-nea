import { Circle, Group, Image, Layer, Rect, Stage, Text, TextPath } from "react-konva";
import type { Settings } from "../App";
import useImage from "use-image";
import { useState } from "react";
import { getCharacterIcon } from "../funcs";

export default function Grim({settings}: {settings: Settings}) {
    const Player = (starting_character: string, name: string) => {
        const [character, setCharacter] = useState(starting_character);
        const [characterImage] = useImage(getCharacterIcon(character));

        const tokenSize = settings.tokenSize;
        const tokenRadius = Math.floor(tokenSize / 2);
        
        const scaleFactor = Math.floor(tokenSize / 50);
        const start = `${15*scaleFactor},${5*scaleFactor}`;
        const end = `${35*scaleFactor},${5*scaleFactor}`;
        const radii = `${22*scaleFactor},${22*scaleFactor}`;
        const svg = `M${start} A${radii} 0 1 0 ${end}`;
        console.log(svg);

        return <Group
            draggable={true}
            onDblClick={() => setCharacter("undertaker")}
            id={name}
            >
            <Circle
                x={tokenRadius}
                y={tokenRadius}
                radius={tokenRadius}
                fill="red"
            />
            <Image
                image={characterImage}
                width={tokenSize}
                height={tokenSize}
            />
            <TextPath
                data={svg}
                text={character}
                fill="black"
                align="center"
            />
            <Group draggable={true} >
                <Rect
                    fill={settings.secondaryColour}
                    width={50} height={20}
                    cornerRadius={5}
                    stroke={settings.textColour}
                    strokeWidth={1}
                />
                <Text x={3} y={1} text={name} fontFamily="Fredoka" fontSize={14} fill={settings.textColour} />
            </Group>
        </Group>
    };

    const players = [
        {"character": "washerwoman", "name": "Alice"},
        {"character": "librarian", "name": "Bob"},
        {"character": "investigator", "name": "Carol"},
        {"character": "poisoner", "name": "David"},
        {"character": "imp", "name": "Edith"}
    ].map((item) => {
        return Player(item.character, item.name)
    });

    return <Stage width={500} height={500}>
        <Layer id="test">
            <Rect width={500} height={500} fill={settings.backgroundColour} cornerRadius={10} />
        </Layer>
        <Layer id="player-tokens">{players}</Layer>
        <Layer id="reminder-tokens"></Layer>
    </Stage>
}