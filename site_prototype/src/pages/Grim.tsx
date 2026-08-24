import type { Settings } from "../App";
import useImage from "use-image";
import { useRef, useState, type ReactElement } from "react";
import { angleFromIndex, getCharacterIcon,  } from "../funcs";
import roleData from "../botc_roles.json";
import { Group as GroupType} from "konva/lib/Group";
import type { KonvaEventObject, NodeConfig, Node as NodeType } from "konva/lib/Node";
import type { Layer as LayerType} from "konva/lib/Layer"
import { Stage, Layer, Rect, Group, Image, Text, TextPath, Circle } from "react-konva";


type KonvaEvent = KonvaEventObject<MouseEvent, NodeType<NodeConfig>>;
type PlayerProperties = {character: string, name: string, x: number, y: number, isMenuOpen: boolean};
type NewPlayerProperties = {character?: string, name?: string, x?: number, y?: number, isMenuOpen?: boolean};

const getCharacterData = (characterID: string) => {
    let output = roleData[0];
    roleData.forEach((value) => {
        if (value.id == characterID) {output = value}
    })
    return output;
}

export default function Grim({settings}: {settings: Settings}) {
    const Player = (
        {character, name, position, isMenuOpen, setPlayer, ...rest}: {
            character: string,
            name: string,
            position: {x: number, y: number}
            isMenuOpen: boolean,
            setPlayer: (name: string|undefined, properties: NewPlayerProperties) => void
        }
    ) => {
        const player = useRef<GroupType>(null);
        const setX = (newX: number) => setPlayer(player.current?.id(), {x: newX});
        const setY = (newY: number) => setPlayer(player.current?.id(), {y: newY});
        const setPosition = (newPosition: {x: number, y: number}) => {
            setX(newPosition.x);
            setY(newPosition.y);
        }
        const setIsMenuOpen = (newMenu: boolean) => setPlayer(player.current?.id(), {isMenuOpen: newMenu}); //TODO find out why it no longer functions even though it's the same as position and stuff, although maybe it isn't??????
        
        const handlePlayerDrag = () => {
            if (!player.current) {return}
            const playerc = player.current //? player current
            
            const size = settings.tokenSize;
            if (playerc.absolutePosition().x < 0) {playerc.x(1)} //? Bugs out if set to 0 instead of 1
            if (playerc.absolutePosition().y < 0) {playerc.y(1)} //? Bugs out if set to 0 instead of 1
            if ((playerc.absolutePosition().x + size) > settings.grimWidth) {playerc.x(settings.grimWidth - size)}
            if ((playerc.absolutePosition().y + size) > settings.grimHeight) {playerc.y(settings.grimHeight - size)}
            
            checkMenuBorder(playerc.findOne("#menu"));
        }
        const handleEndOfDrag = () => {
            if (!player.current) {return}
            const playerc = player.current //? player current
            setPosition(playerc.absolutePosition());
        }
        
        const [characterImage] = useImage(getCharacterIcon(character));
        
        const toggleIsMenuOpen = () => setIsMenuOpen(!isMenuOpen);
        //* Determine whether to switch the side that the menu is on
        const checkMenuBorder = (menu: NodeType<NodeConfig> | undefined) => {
            if (!menu) {return};
            
            menu.x(settings.tokenSize + 5); //? Set to its default position
            const menuPosition = menu.getAbsolutePosition();
            const right_edge = menuPosition.x + menu.width();
            
            if (right_edge > 500) {
                menu.x(-105);
            }
        }
        
        const onDoubleClick = () => {
            if (!player.current) {return}
            const playerc = player.current //? player current

            const menu = playerc.findOne("#menu");
            if (!menu) {return};
            
            toggleIsMenuOpen();
            playerc.moveToTop();
            menu.moveToTop();
            
            checkMenuBorder(menu);
        }
        
        const tokenSize = settings.tokenSize;
        const tokenRadius = settings.halfTokenSize;
        
        //? Used to create the path for the character name to follow
        const scaleFactor = Math.floor(tokenSize / 50);
        const start = `${15*scaleFactor},${5*scaleFactor}`;
        const radii = `${22*scaleFactor},${22*scaleFactor}`;
        const end = `${35*scaleFactor},${5*scaleFactor}`;
        const svg = `M${start} A${radii} 0 1 0 ${end}`;

        
        return <Group
        draggable
        onDragStart={(e) => {e.currentTarget.moveToTop()}} onDragMove={handlePlayerDrag} onDragEnd={handleEndOfDrag}
        onDblClick={onDoubleClick} onDblTap={onDoubleClick}
        id={name} ref={player}
        x={position.x} y={position.y}
        {...rest}
        >
            {/* //* Background */}
            <Circle
                x={tokenRadius}
                y={tokenRadius}
                radius={tokenRadius}
                fill={settings.tokenBackgroundColour}
            />

            {/* //* Character Image */}
            <Image
                image={characterImage}
                width={tokenSize}
                height={tokenSize}
            />

            {/* //* Character Name */}
            <TextPath
                data={svg}
                text={`${character}${isMenuOpen}`}
                fill="black"
                align="center"
            />

            {/* //* Name Tag */}
            <Group>
                <Rect
                    fill={settings.secondaryColour}
                    width={50} height={20}
                    cornerRadius={5}
                    stroke={settings.textColour}
                    strokeWidth={1}
                />
                <Text x={3} y={1} text={name} fontFamily="Fredoka" fontSize={14} fill={settings.textColour} />
            </Group>

            {/* //* Toggleable Menu */}
            <Group id="menu" visible={isMenuOpen} x={settings.tokenSize + 5} width={100} height={100} >
                {/* //* Background */}
                <Rect fill={settings.secondaryColour} width={100} height={100} />

                {/* //* Change Character Button */}
                {/* //~~ NOT IMPLEMENTED */}
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
                        setIsMenuOpen(false);
                    }}
                    onTap={() => {
                        setCurrentPlayer(name);
                        setIsAddReminderVisible(true);
                        setIsMenuOpen(false);
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
    const reminderButtonElements: ReactElement[] = [];
    let index = 0;
    //* Iterate through all characters and their reminders (supplied from https://release.botc.app/resources/data/roles.json (https://release.botc.app/resources))
    script.forEach((characterID) => {
        const characterData = getCharacterData(characterID);

        let allReminders = characterData.reminders;
        if (characterData.remindersGlobal) {
            allReminders = [...allReminders, ...characterData.remindersGlobal];
        } //? Some characters have global reminders so they need to be added if present
        allReminders.forEach((reminderText) => {
            reminderButtonElements.push(<Reminder
                reminderID={`${characterID}.${reminderText}`}
                x={(index % 5) * 60} y={Math.floor(index / 5) * 70 + 30}
                onClick={(e: KonvaEvent) => {
                    console.log(`Adding ${characterID}.${reminderText} to ${currentPlayer}`);
                    setIsAddReminderVisible(false);
                    const stage = e.currentTarget.getStage();
                    if (!stage) {return}

                    const reminderLayer: LayerType|undefined = stage.findOne("#reminder-tokens");
                    const playerLayer: LayerType|undefined = stage.findOne("#player-tokens");
                    const currentPlayerElement = playerLayer?.findOne(`#${currentPlayer}`);
                    if (!reminderLayer || !playerLayer || !currentPlayerElement) {return}

                    // reminderLayer.add(<Reminder
                    //     x={currentPlayerElement.x()}
                    //     y={currentPlayerElement.y()}

                    // />);
                    //TODO Add <Reminder...> to reminders layer on top of gary? or specific distance inwards
                    //TODO Make settings persistant across pages
                }}
            />);
            index++;
        });
    });

    const [players, setPlayers] = useState<PlayerProperties[]>([
        {character: "washerwoman", name: "Alice", x: 0, y: 0, isMenuOpen: false},
        {character: "librarian", name: "Bob", x: 0, y: 0, isMenuOpen: false},
        {character: "investigator", name: "Carol", x: 0, y: 0, isMenuOpen: false},
        {character: "poisoner", name: "David", x: 0, y: 0, isMenuOpen: false},
        {character: "imp", name: "Edith", x: 0, y: 0, isMenuOpen: false},
        {character: "ravenkeeper", name: "Freya", x: 0, y: 0, isMenuOpen: false},
        {character: "monk", name: "Gary", x: 0, y: 0, isMenuOpen: false}
    ]);

    //! Add new player properties here each time
    const setPlayer = (name: string|undefined, properties: NewPlayerProperties) => {
        if (!name) {return}

        const newPlayers: PlayerProperties[] = []; 
        players.forEach((player) => {
            const tempPlayer = player;
            if (player.name == name) {
                if (properties.character) {tempPlayer.character = properties.character}
                if (properties.name) {tempPlayer.name = properties.name}
                if (properties.x) {tempPlayer.x = properties.x}
                if (properties.y) {tempPlayer.y = properties.y}
                if (properties.isMenuOpen) {tempPlayer.isMenuOpen = properties.isMenuOpen}
            }
            newPlayers.push(tempPlayer);
        });
        setPlayers(newPlayers);
    }

    const player_tokens = players.map((player) => {
        return <Player
            character={player.character}
            name={player.name}
            position={{x: player.x, y: player.y}}
            isMenuOpen={player.isMenuOpen}
            setPlayer={setPlayer}
        />
    });

    const [currentPlayer, setCurrentPlayer] = useState("initial"); //* Player Element's ID
    const [isAddReminderVisible, setIsAddReminderVisible] = useState(false);

    const changeCursor = (e: KonvaEvent, cursor: string) => {
        const stage = e.target.getStage();
        if (!stage) {return}
        stage.container().style.cursor = cursor;
    }

    if (currentPlayer == "initial") {
        players.forEach((player, index) => {
            setPlayer(player.name, {
                x: settings.initialTokenCircleRadius * Math.sin(angleFromIndex(index, players.length)) - settings.halfTokenSize + 250,
                y: settings.initialTokenCircleRadius * Math.cos(angleFromIndex(index, players.length)) - settings.halfTokenSize + 250
            });
            setCurrentPlayer("none");
        })
    }

    return <Stage width={500} height={500}>
        <Layer id="background">
            <Rect width={500} height={500} fill={settings.backgroundColour} cornerRadius={10} />
        </Layer>
        <Layer id="player-tokens">{player_tokens}</Layer>
        <Layer id="reminder-tokens"></Layer>
        <Layer id="menus">
            {/* //* Add Reminder Menu */}
            <Group
            id="add-reminder"
            visible={isAddReminderVisible}
            onDblClick={() => setIsAddReminderVisible(false)} onDblTap={() => setIsAddReminderVisible(false)}
            x={100} y={100}
            >
                <Rect width={300} height={300} fill={settings.secondaryColour} cornerRadius={10} />
                <Text x={4} y={4} text={`Add reminder to ${currentPlayer}`} fill={settings.textColour} fontSize={20} />
                {reminderButtonElements}
            </Group>
        </Layer>
    </Stage>
}