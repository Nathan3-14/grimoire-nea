import type { Settings } from "../App";
import useImage from "use-image";
import { useState, type ReactElement } from "react";
import { angleFromIndex, getCharacterIcon,  } from "../funcs";
import roleData from "../botc_roles.json";
import type {Group as GroupType} from "konva/lib/Group";
import type { KonvaEventObject, NodeConfig, Node as NodeType } from "konva/lib/Node";
import { Stage, Layer, Rect, Group, Image, Text, TextPath, Circle } from "react-konva";


type KonvaEvent = KonvaEventObject<DragEvent, NodeType<NodeConfig>>

const getCharacterData = (characterID: string) => {
    let output = roleData[0];
    roleData.forEach((value) => {
        if (value.id == characterID) {output = value}
    })
    return output;
}

export default function Grim({settings}: {settings: Settings}) {
    const Player = ({starting_character="", name="", ...rest}) => {
        const handlePlayerDrag = (e: KonvaEvent) => {
            const player: GroupType = e.currentTarget;
            const position = player.getAbsolutePosition();
            const size = settings.tokenSize;
        
            if (position.x < 0) {player.x(0)}
            if (position.y < 0) {player.y(0)}
            if ((position.x + size) > settings.grimWidth) {player.x(settings.grimWidth - size)}
            if ((position.y + size) > settings.grimHeight) {player.y(settings.grimHeight - size)}
    
            checkMenuBorder(player.findOne("#menu"));
        }

        const [character, setCharacter] = useState(starting_character);
        const [characterImage] = useImage(getCharacterIcon(character));
        const [isMenuVisible, setIsMenuVisisble] = useState(false);

        const toggleIsMenuVisible = () => setIsMenuVisisble(!isMenuVisible);
        const checkMenuBorder = (menu: NodeType<NodeConfig> | undefined) => {
            if (!menu) {return};

            menu.x(settings.tokenSize + 5); //? Placed here to prevent flickering effect

            const menuPosition = menu.getAbsolutePosition();
            const right_edge = menuPosition.x + menu.width();
            
            if (right_edge > 500) {
                menu.x(-105);
            }
        }

        const onDoubleClick = (e: KonvaEvent) => {
            const player: GroupType = e.currentTarget;
            const menu = player.findOne("#menu");
            if (!menu) {return};

            toggleIsMenuVisible();
            player.moveToTop();
            menu.moveToTop();

            checkMenuBorder(menu);
        }

        const tokenSize = settings.tokenSize;
        const tokenRadius = settings.halfTokenSize;
        
        const scaleFactor = Math.floor(tokenSize / 50);
        const start = `${15*scaleFactor},${5*scaleFactor}`;
        const radii = `${22*scaleFactor},${22*scaleFactor}`;
        const end = `${35*scaleFactor},${5*scaleFactor}`;
        const svg = `M${start} A${radii} 0 1 0 ${end}`;

        return <Group
            draggable={true}
            onDragStart={(e) => {e.currentTarget.moveToTop()}}
            onDragMove={handlePlayerDrag}
            onDblClick={onDoubleClick}
            onDblTap={onDoubleClick}
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
            <Group id="menu" visible={isMenuVisible} x={settings.tokenSize + 5} width={100} height={100} >
                <Rect fill={settings.secondaryColour} width={100} height={100} />
                <Text
                    fill={settings.linkColour}
                    onMouseEnter={(e) => changeCursor(e, "pointer")}
                    onMouseLeave={(e) => changeCursor(e, "default")}
                    text="Change Character"
                    fontSize={11} fontStyle="bold"
                />
                <Text
                    y={17}
                    fill={settings.linkColour}
                    onMouseEnter={(e) => changeCursor(e, "pointer")}
                    onMouseLeave={(e) => changeCursor(e, "default")}
                    text="Add Reminder"
                    onClick={(e) => {
                        setCurrentPlayer(name);
                        changeCursor(e, "default");
                        setIsAddReminderVisible(true);
                        setIsMenuVisisble(false);
                    }}
                    onTap={(e) => {
                        setCurrentPlayer(name);
                        setIsAddReminderVisible(true);
                        setIsMenuVisisble(false);
                    }}
                    fontSize={11} fontStyle="bold"
                />
            </Group>
        </Group>
    };

    const Reminder = ({reminderID="", ...rest}) => {
        const reminderImageURL = getCharacterIcon(reminderID.split(".")[0]);
        return <Group width={60} height={60} id={reminderID} {...rest}>
            <Circle x={30} y={30} radius={30} fill={settings.tokenBackgroundColour} />
            <Image width={60} height={60} image={useImage(reminderImageURL)[0]} />
            <Text text={reminderID.split(".")[1]} fill={settings.textColour} width={60} align="center"/>
        </Group>
    }

    const script = ["imp", "scarletwoman", "baron", "spy", "poisoner", "drunk", "saint", "butler", "recluse", "washerwoman", "librarian", "investigator", "chef", "empath", "fortuneteller", "soldier", "monk", "mayor", "slayer", "virgin", "ravenkeeper", "undertaker"]
    const reminderElements: ReactElement[] = [];
    let index = 0;
    script.forEach((characterID) => {
        const characterData = getCharacterData(characterID);

        let allReminders = characterData.reminders;
        if (characterData.remindersGlobal) {
            allReminders = [...allReminders, ...characterData.remindersGlobal];
        }
        allReminders.forEach((reminderText) => {
            reminderElements.push(<Reminder
                reminderID={`${characterID}.${reminderText}`}
                x={(index % 5) * 60}
                y={Math.floor(index / 5) * 70 + 30}
                onClick={() => {
                    console.log(`Adding ${characterID}.${reminderText} to ${currentPlayer}`);
                    setIsAddReminderVisible(false);
                    //TODO Add <Reminder...> to reminders layer on top of gary? or specific distance inwards
                }}
            />);
            index++;
        });
    });

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
    const [currentPlayer, setCurrentPlayer] = useState("none"); //* Player Element's ID
    const [isAddReminderVisible, setIsAddReminderVisible] = useState(false);

    const changeCursor = (e, cursor: string) => {
        e.target.getStage().container().style.cursor = cursor;
    }

    return <Stage width={500} height={500}>
        <Layer id="background">
            <Rect width={500} height={500} fill={settings.backgroundColour} cornerRadius={10} />
        </Layer>
        <Layer id="player-tokens">{player_tokens}</Layer>
        <Layer id="menus">
            {/* Add Reminder Menu */}
            <Group
            id="add-reminder"
            visible={isAddReminderVisible}
            onDblClick={() => setIsAddReminderVisible(false)} onDblTap={() => setIsAddReminderVisible(false)}
            x={100} y={100}
            >
                <Rect width={300} height={300} fill={settings.secondaryColour} cornerRadius={10} />
                <Text x={4} y={4} text={`Add reminder to ${currentPlayer}`} fill={settings.textColour} fontSize={20} />
                {reminderElements}
            </Group>
        </Layer>
        <Layer id="reminder-tokens"></Layer>
    </Stage>
}