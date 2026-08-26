import { Circle, Group, Image, Text } from "react-konva";
import { Group as GroupType} from "konva/lib/Group";
import type { Settings } from "../App";
import { checkCircleInsideGrim, getCharacterIcon } from "../funcs";
import useImage from "use-image";
import { useRef } from "react";

export type ReminderProperties = {id: string, x: number, y: number};
export type NewReminderProperties = {id?: string, x?: number, y?: number};

export const Reminder = (
    {settings, reminderID, owner, x, y, setReminder, ...rest}: {
        settings: Settings,
        reminderID: string,
        owner?: string,
        x: number,
        y: number,
        setReminder?: (playerName: string, reminderID: string, properties: NewReminderProperties) => void
        [_: string]: any
    }) => {
    const reminder = useRef<GroupType>(null);

    const reminderImageURL = getCharacterIcon(reminderID.split(".")[0]);

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
    };
    const handleEndOfDrag = () => {
        const reminderc = reminder.current;
        if (!reminderc) {return}
        if (!setReminder) {return}
        if (!owner) {return}
        const position = reminderc.getAbsolutePosition();
        setReminder(owner, reminderc.id(), {x: position.x, y: position.y});
    };

    return <Group
        ref={reminder}
        id={reminderID}
        x={x} y={y} 
        width={settings.reminderSize} 
        height={settings.reminderSize} 
        onDragMove={handleDrag}
        onDragEnd={handleEndOfDrag}
        {...rest}>
        <Circle
            x={30} y={30}
            radius={settings.halfReminderSize}
            fill={settings.tokenBackgroundColour}
        />
        <Image width={60} height={60} image={useImage(reminderImageURL)[0]} />
        {/* <Text text={`${x} ${y}`} fill={settings.textColour} width={60} align="center"/> //DEBUG */}
        <Text text={reminderID.split(".")[1] + `${x} ${y}`} fill={settings.textColour} width={60} align="center"/>
    </Group>
}