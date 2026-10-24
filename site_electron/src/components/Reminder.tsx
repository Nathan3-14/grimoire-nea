import { Circle, Group, Image, Text } from "react-konva";
import { Group as GroupType} from "konva/lib/Group";
import type { Settings } from "../App";
import { checkCircleInsideGrim, getCharacterIconURL } from "../funcs";
import useImage from "use-image";
import { useRef } from "react";

export type ReminderProperties = {id: string, x: number, y: number};
export type NewReminderProperties = {id?: string, x?: number, y?: number};

export const Reminder = (
    {settings, reminderID, owner, x, y, inRadius, setReminder, ...rest}: {
        settings: Settings,
        reminderID: string,
        owner?: string,
        x: number,
        y: number,
        inRadius?: number,
        setReminder?: (playerName: string, reminderID: string, properties: NewReminderProperties) => void
        [_: string]: any
    }) => {
    const reminder = useRef<GroupType>(null);

    const reminderImageURL = getCharacterIconURL(reminderID.split(".")[0]);

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
    const radius = inRadius ? inRadius : settings.halfReminderSize;
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
        <Text text={reminderID.split(".")[1]} fill={settings.textColour} width={diameter} align="center" wrap="char" />
    </Group>
}