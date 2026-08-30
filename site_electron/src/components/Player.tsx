import { useEffect, useRef } from "react";
import useImage from "use-image";
import { checkCircleInsideGrim, getCharacterIcon } from "../funcs";
import { Group as GroupType} from "konva/lib/Group";
import type { Settings } from "../App";
import { Circle, Group, Image, Rect, Text, TextPath } from "react-konva";
import type { KonvaEventObject, NodeConfig, Node as NodeType } from "konva/lib/Node";
import type { ReminderProperties } from "./Reminder";
import shroud from "../assets/images/shroud.png"

export type PlayerProperties = {character: string, name: string, x: number, y: number, isMenuOpen: boolean, reminders: ReminderProperties[], isDead: boolean};
export type NewPlayerProperties = {character?: string, name?: string, x?: number, y?: number, isMenuOpen?: boolean, reminders?: ReminderProperties[], isDead?: boolean};
type KonvaEvent = KonvaEventObject<MouseEvent, NodeType<NodeConfig>>;

export const Player = (
        {settings, character, name, x, y, isMenuOpen, isDead, setPlayer, functions, ...rest}: {
            settings: Settings,
            character: string,
            name: string,
            x: number,
            y: number,
            isMenuOpen: boolean,
            isDead: boolean,
            setPlayer: (name: string|undefined, properties: NewPlayerProperties) => void,
            functions: {
                setCurrentPlayer: (name: string) => void,
                setIsAddReminderVisible: (newState: boolean) => void,
                changeCursor: (e: KonvaEvent, newCursor: string) => void
            };
        }
    ) => {
        const player = useRef<GroupType>(null);
        const [characterImage] = useImage(getCharacterIcon(character));

        //* Setup useful functions
        const setX = (newX: number) => setPlayer(player.current?.id(), {x: newX});
        const setY = (newY: number) => setPlayer(player.current?.id(), {y: newY});
        const setPosition = (newPosition: {x: number, y: number}) => {
            setX(newPosition.x);
            setY(newPosition.y);
        }
        const setIsMenuOpen = (newMenu: boolean) => {
            console.log(`setting ${player.current?.id()} to ${newMenu}`);
            setPlayer(player.current?.id(), {isMenuOpen: newMenu});
        }
        const toggleIsMenuOpen = () => setIsMenuOpen(!isMenuOpen);
        

        const handlePlayerDrag = () => {            
            const playerc = player.current; //? player current
            if (!playerc) {return}

            checkCircleInsideGrim(
                playerc.absolutePosition(),
                settings.tokenSize,
                settings,
                {
                    left: () => playerc.x(0),
                    right: () => playerc.x(settings.grimWidth - settings.tokenSize),
                    top: () => playerc.y(0),
                    bottom: () => playerc.y(settings.grimHeight - settings.tokenSize)
                }
            );
            
            checkMenuBorder();
        };
        const handleEndOfDrag = () => {
            const playerc = player.current; //? player current
            if (!playerc) {return}
            setPosition(playerc.absolutePosition());
        };
        
        

        //* Determine whether to switch the side that the menu is on
        const checkMenuBorder = () => {
            const menu = player.current?.findOne("#menu")
            if (!menu) {return};
            
            menu.x(settings.tokenSize + 5); //? Set to its default position
            const menuPosition = menu.getAbsolutePosition();
            const right_edge = menuPosition.x + menu.width();
            
            if (right_edge > 500) {
                menu.x(-105);
            }
        }
        
        const onDoubleClick = () => {
            toggleIsMenuOpen();        
            // checkMenuBorder();
        }
        
        const tokenSize = settings.tokenSize;
        const tokenRadius = settings.halfTokenSize;
        
        //? Used to create the path for the character name to follow
        const scaleFactor = Math.floor(tokenSize / 50);
        const start = `${15*scaleFactor},${5*scaleFactor}`;
        const radii = `${22*scaleFactor},${22*scaleFactor}`;
        const end = `${35*scaleFactor},${5*scaleFactor}`;
        const svg = `M${start} A${radii} 0 1 0 ${end}`;

        //? Runs every time the page reloads
        useEffect(() => {
            checkMenuBorder();
        });

        return <Group
        draggable
        onDragStart={(e) => {e.currentTarget.moveToTop()}} onDragMove={handlePlayerDrag} onDragEnd={handleEndOfDrag}
        onDblClick={onDoubleClick} onDblTap={onDoubleClick}
        id={name} ref={player}
        x={x} y={y}
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
                text={character}
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
                    onMouseEnter={(e) => functions.changeCursor(e, "pointer")}
                    onMouseLeave={(e) => functions.changeCursor(e, "default")}
                    text="Change Character"
                    fill={settings.linkColour}
                    fontSize={11} fontStyle="bold"
                />
                <Text
                    y={17}
                    onMouseEnter={(e) => functions.changeCursor(e, "pointer")}
                    onMouseLeave={(e) => functions.changeCursor(e, "default")}
                    text="Add Reminder"
                    onClick={(e) => {
                        functions.setCurrentPlayer(name);
                        functions.changeCursor(e, "default");
                        functions.setIsAddReminderVisible(true);
                        setIsMenuOpen(false);
                    }}
                    onTap={() => {
                        functions.setCurrentPlayer(name);
                        functions.setIsAddReminderVisible(true);
                        setIsMenuOpen(false);
                    }}
                    fill={settings.linkColour}
                    fontSize={11} fontStyle="bold"
                    />
                <Text
                    y={34}
                    onMouseEnter={(e) => functions.changeCursor(e, "pointer")}
                    onMouseLeave={(e) => functions.changeCursor(e, "default")}
                    text="Toggle Dead"
                    onClick = {(e) => {
                        functions.changeCursor(e, "default");
                        setPlayer(name, {isDead: !isDead});
                        setIsMenuOpen(false);
                    }}
                    onTap = {() => {
                        setPlayer(name, {isDead: !isDead});
                        setIsMenuOpen(false);
                    }}
                    fill={settings.linkColour}
                    fontSize={11} fontStyle="bold"
                />
            </Group>

            {/* //* Toggleable Death Shroud */}
            <Image
                image={useImage(shroud)[0]}
                x={(settings.tokenSize-((settings.tokenSize/250) * 150))/2} //? Adjust for top left positioning
                height={settings.tokenSize}
                width={(settings.tokenSize/250) * 150}
                visible={isDead}
                opacity={0.8}
            />
        </Group>
    };
