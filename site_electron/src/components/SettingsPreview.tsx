import { Circle, Layer, Rect, Stage, Text } from "react-konva";
import { Settings } from "../App";
import { angleFromIndex } from "../funcs";

export default function SettingsPreview({settings, previewPlayerCount}: {settings: Settings, previewPlayerCount: number}) {
    {/* //TODO Add preview for secondary colour! */}
    const examplePlayers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((_item, index) => {
        const halfTokenCircleRadius = settings.initialTokenCircleRadius / 2;
        const quarterTokenSize = settings.halfTokenSize / 2;
        return <Circle
            radius={quarterTokenSize}
            fill={settings.tokenBackgroundColour}
            x={halfTokenCircleRadius * Math.sin(angleFromIndex(index, previewPlayerCount)) + 125}
            y={halfTokenCircleRadius * Math.cos(angleFromIndex(index, previewPlayerCount)) + 125}
        />
    });

    return <>
        <Stage width={250} height={250}>
            <Layer id="background">
                <Rect fill={settings.backgroundColour} width={250} height={250} stroke={settings.textColour} strokeWidth={2.5} />
            </Layer>
            <Layer id="tokens">
                {examplePlayers}
            </Layer>
            <Layer id="menu">
                <Rect fill={settings.secondaryColour} width={80} height={80} cornerRadius={5} x={85} y={85} />
                <Text text="Preview" fill={settings.textColour} x={90} y={90} />
                <Text text="Preview" fill={settings.tokenTextColour} x={30} y={40} />
            </Layer>
        </Stage>
    </>
}