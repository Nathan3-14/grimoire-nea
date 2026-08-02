import { Group, Image, Layer, Rect, Stage, Text, TextPath } from "react-konva";
import type { Settings } from "../App";
import useImage from "use-image";
import { useState } from "react";
import { getCharacterIcon } from "../funcs";

export default function Grim({settings}: {settings: Settings}) {
    const Player = (starting_character: string, name: string) => {
        const [character, setCharacter] = useState(starting_character);
        const [characterImage] = useImage(getCharacterIcon(character));
        return <Group draggable={true}>
            <Image
                image={characterImage}
                width={50}
                height={50}
            />
            {/* <Text text={name} /> */}
            <TextPath
                data="M15,5 A22,22 0 1 0 35,5"
                text={name}
                fill="black"
                textOffset={20}
            />
        </Group>
    };

    const players = [
        {"character": "washerwoman", "name": "Alice"},
        {"character": "librarian", "name": "Bob"},
        {"character": "investigator", "name": "Carol"},
        {"character": "poisoner", "name": "David"},
        {"character": "imp", "name": "Edith"}
    ].map((item) => {
        Player(item.character, item.name)
    });

    return <Stage width={500} height={500}>
        <Layer id="test">
            {Player("imp", "test")}
        </Layer>
        <Layer id="player-tokens">{players}</Layer>
        <Layer id="reminder-tokens"></Layer>
    </Stage>
}