import { Group, Rect, Text } from "react-konva";
import { Settings } from "../App";
import { KonvaEventObject, Node as NodeType, NodeConfig } from "konva/lib/Node";

type KonvaEvent = KonvaEventObject<MouseEvent, NodeType<NodeConfig>>;

export default function KonvaButton({settings, width, height, secondary, onClick, text}: {settings: Settings, width?: number, height?: number, secondary?: boolean, onClick?: (e: KonvaEvent) => void, text?: string}) {
    const changeCursor = (e: KonvaEvent, cursor: string) => {
    const stage = e.target.getStage();
    if (!stage) {return}
        stage.container().style.cursor = cursor;
    }

    return <Group
        onMouseEnter={(e) => changeCursor(e, "pointer")}
        onMouseLeave={(e) => changeCursor(e, "default")}
        onClick={(e) => {
            changeCursor(e, "default");
            if (onClick) {onClick(e)}
        }}
    >
        <Rect width={width ? width : 200} height={height ? height: 100} stroke={secondary ? settings.backgroundColour : settings.secondaryColour} strokeWidth={2} />
        <Text
            text={text}
            fill={settings.linkColour}
            fontSize={11} fontStyle="bold"
        />
    </Group>
}