import { Circle, Group, Image, Layer, Rect, Stage, Text, TextPath } from "react-konva";
import type { Settings } from "../App";
import useImage from "use-image";
import { useState } from "react";
import { angleFromIndex, getCharacterIcon, isInsideStage } from "../funcs";


export default function Grim({settings}: {settings: Settings}) {
    const Player = ({starting_character="", name="", ...rest}) => {
        const [character, setCharacter] = useState(starting_character);
        const [characterImage] = useImage(getCharacterIcon(character));
        const [isMenuVisible, setIsMenuVisisble] = useState(false);
        const toggleIsMenuVisible = () => setIsMenuVisisble(!isMenuVisible);

        const tokenSize = settings.tokenSize;
        const tokenRadius = settings.halfTokenSize;
        
        const scaleFactor = Math.floor(tokenSize / 50);
        const start = `${15*scaleFactor},${5*scaleFactor}`;
        const radii = `${22*scaleFactor},${22*scaleFactor}`;
        const end = `${35*scaleFactor},${5*scaleFactor}`;
        const svg = `M${start} A${radii} 0 1 0 ${end}`;

        return <Group
            draggable={true}
            onDblClick={toggleIsMenuVisible}
            onDblTap={toggleIsMenuVisible}
            onDragEnd={(e) => {console.log(isInsideStage(e.target, e.target.getStage()))}}
            // onDragEnd={(e) => {console.log(e.target)}}
            id={name}
            {...rest}
            >
            <Circle
                x={tokenRadius}
                y={tokenRadius}
                radius={tokenRadius}
                fill={settings.tokenBackgroundColour}
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
            {/* Name Tag */}
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

            {/* Toggleable Menu */}
            <Group>
                <Rect x={settings.tokenSize + 5} fill={settings.secondaryColour} width={100} height={100} visible={isMenuVisible} />
            </Group>
        </Group>
    };

    const players = [
        {"character": "washerwoman", "name": "Alice"},
        {"character": "librarian", "name": "Bob"},
        {"character": "investigator", "name": "Carol"},
        {"character": "poisoner", "name": "David"},
        {"character": "imp", "name": "Edith"},
        {"character": "ravenkeeper", "name": "Freya"},
        {"character": "monk", "name": "Gary"}
    ]
    const player_tokens = players.map((item, index) => {
        return <Player
            starting_character={item.character}
            name={item.name}
            x={settings.initialTokenCircleRadius * Math.sin(angleFromIndex(index, players.length)) - settings.halfTokenSize + 250}
            y={settings.initialTokenCircleRadius * Math.cos(angleFromIndex(index, players.length)) - settings.halfTokenSize + 250}
        />
    });

    return <Stage width={500} height={500}>
        <Layer id="test">
            <Rect width={500} height={500} fill={settings.backgroundColour} cornerRadius={10} />
        </Layer>
        <Layer id="player-tokens">{player_tokens}</Layer>
        <Layer id="reminder-tokens"></Layer>
    </Stage>
}