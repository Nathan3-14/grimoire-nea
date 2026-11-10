import { Circle, Group, Image, Text } from "react-konva";
import { Group as GroupType} from "konva/lib/Group";
import type { Settings } from "../App";
import { addReminderToPlayer, checkCircleInsideGrim, getCharacterIconURL, removeReminderFromPlayer, setPlayer } from "../funcs";
import useImage from "use-image";
import { useRef } from "react";
import { GrimData } from "../pages/NewGrim";

export type ReminderProperties = {id: string, x: number, y: number};
export type NewReminderProperties = {id?: string, x?: number, y?: number};


export const Reminder = (
    {settings, reminderID, owner, x, y, radius, setReminder, grimData, ...rest}: {
        settings: Settings,
        reminderID: string,
        grimData: GrimData
        owner?: string,
        x: number,
        y: number,
        radius?: number,
        setReminder?: (playerName: string, reminderID: string, properties: NewReminderProperties) => void
        [_: string]: any
    }) => {
    const reminder = useRef<GroupType>(null);

    const reminderImageURL = getCharacterIconURL(reminderID.split(".")[0]);

    const checkReminderOverPlayer = (reminder: GroupType) => {
        const x = reminder.x();
        const y = reminder.y();
        grimData.players.forEach((player) => {
            const playerX = player.x;
            const playerY = player.y;

            if (
                (playerX-settings.reminderChangeBoundary <= x+settings.reminderSize) &&
                (x <= playerX+settings.reminderChangeBoundary+settings.tokenSize) &&
                (playerY-settings.reminderChangeBoundary <= y+settings.reminderSize) &&
                (y <= playerY+settings.reminderChangeBoundary+settings.tokenSize)
            ) {
                if (player.isReminderOver == false) {setPlayer(grimData, player.name, {isReminderOver: true})}
                console.log(`Reminder inside ${player.name}`);
            } else {
                if (player.isReminderOver == true) {setPlayer(grimData, player.name, {isReminderOver: false})}
            }
        });
    }

    const handleDrag = () => {
        const reminderc = reminder.current;
        if (!reminderc) {return}

        checkCircleInsideGrim(
            reminderc.absolutePosition(),
            settings.reminderSize,
            settings,
            {
                left: () => reminderc.x(0),
                right: () => reminderc.x(settings.grimWidth - settings.tokenSize),
                top: () => reminderc.y(0),
                bottom: () => reminderc.y(settings.grimHeight - settings.tokenSize)
            }
        );

        checkReminderOverPlayer(reminderc);
    };
    const handleEndOfDrag = () => {
        const reminderc = reminder.current;
        if (!reminderc) {return}
        if (!setReminder) {return}
        if (!owner) {return}

        grimData.players.forEach((player) => {
            if (player.isReminderOver) {
                removeReminderFromPlayer(grimData, owner, reminderID);
                addReminderToPlayer(settings, grimData, player.name, reminderID);
                setPlayer(grimData, player.name, {isReminderOver: false});
            }
        });
        
        // setReminder(newOwner, reminderc.id(), {x: position.x, y: position.y});
    };
    radius = radius ? radius : settings.halfReminderSize;
    const diameter = 2 * radius;

    return <Group
        ref={reminder}
        id={reminderID}
        x={x} y={y} 
        width={diameter} 
        height={diameter} 
        onDragMove={handleDrag}
        onDragEnd={handleEndOfDrag}
        {...rest}>
        <Circle
            x={radius} y={radius}
            radius={radius}
            fill={settings.tokenBackgroundColour}
        />
        <Image width={diameter} height={diameter} image={useImage(reminderImageURL)[0]} />
        <Text text={reminderID.split(".")[1]} fill={settings.tokenTextColour} width={diameter} align="center" wrap="char" />
    </Group>
}