import type { Settings } from "../App";
import { useRef, useState, type ReactElement } from "react";
import { addReminderToPlayer, getCharacterData, getPlayer, removeReminderFromPlayer, restrictRect, setPlayer } from "../funcs";
import { Player } from "../components/Player";
import { Reminder, type NewReminderProperties, type ReminderProperties } from "../components/Reminder";
import { Group, Layer, Rect, Stage, Text } from "react-konva";
import { Group as GroupType } from "konva/lib/Group"
import { Html } from "react-konva-utils"
import { GrimData } from "./NewGrim";
import CharacterSelectPane from "../components/CharacterSelectPane";
import "./Grim.css"


export type ScriptItem = {
    id: string,
    name?: string,
    author?: string
}



export default function Grim({settings, grimData}: {settings: Settings, grimData: GrimData}) {

    const script = grimData.scriptCharacters;
    const reminderButtonElements: ReactElement[] = [];

    //* Iterate through all characters and their reminders (supplied from https://release.botc.app/resources/data/roles.json (https://release.botc.app/resources))
    let index = 0;
    script.forEach((characterID) => {
        const characterData = getCharacterData(characterID);

        //* Combine all lists of reminders from possible locations
        //? Some characters have global reminders so they need to be added if present
        let allReminders = characterData.reminders;
        if (characterData.remindersGlobal) {
            allReminders = [...allReminders, ...characterData.remindersGlobal]; //? joins the two arrays together
        }
        //* Iterate through all of each characters reminder tokens
        const reminderButtonRadius = settings.halfReminderSize * 0.8;
        const reminderButtonGap = reminderButtonRadius * 2 * 1.1;
        allReminders.forEach((reminderText, reminderIndex) => {
            reminderButtonElements.push(<Reminder
                grimData={grimData}
                settings={settings}
                reminderID={`${characterID}.${reminderText}`}
                key={`${characterID}.${reminderText}#${reminderIndex}`}
                x={(index % 7) * reminderButtonGap + 5} y={Math.floor(index / 7) * reminderButtonGap + 30}
                radius={reminderButtonRadius}
                onClick={() => {
                    setIsAddReminderVisible(false);
                    addReminderToPlayer(settings, grimData, currentPlayer, `${characterID}.${reminderText}`);
                }}
            />);
            index++;
        });
    });

    const players = grimData.players;
    // const setPlayers = grimData.setPlayers;


    //! Update when new properties are added
    const setReminder = (playerName: string, reminderID: string, properties: NewReminderProperties) => {
        const newReminders: ReminderProperties[] = [];
        getPlayer(grimData, playerName).reminders.forEach((reminder) => {
            const tempReminder = reminder;
            if (reminder.id == reminderID) {
                if (properties.id) {tempReminder.id = properties.id}
                if (properties.x) {tempReminder.x = properties.x}
                if (properties.y) {tempReminder.y = properties.y}
            };
            newReminders.push(tempReminder);
        });
        setPlayer(grimData, playerName, {reminders: newReminders})
    };
    
    const [currentPlayer, setCurrentPlayer] = useState("none"); //* Player Element's ID
    const [isAddReminderVisible, setIsAddReminderVisible] = useState(false);
    const [isChangeNameVisible, setIsChangeNameVisible] = useState(false);
    const [isChangeCharacterVisible, setIsChangeCharacterVisible] = useState(false);

    const functions = {
        setCurrentPlayer: setCurrentPlayer,
        setIsAddReminderVisible: setIsAddReminderVisible,
        setIsChangeNameVisible: setIsChangeNameVisible,
        setIsChangePlayerVisible: setIsChangeCharacterVisible
    };

    //! Update when playerProperties are
    const playerTokens = players.map((player) => {
        return <Player
            character={player.character}
            name={player.name}
            key={player.name}
            x={player.x}
            y={player.y}
            isMenuOpen={player.isMenuOpen}
            isDead={player.isDead}
            isReminderOver={player.isReminderOver}
            settings={settings}
            grimData={grimData}
            setPlayer={setPlayer}
            functions={functions}
        />
    });

    const reminderTokens: ReactElement[] = [];
    players.forEach((player) => {
        player.reminders.forEach((reminder) => {
            reminderTokens.push(<Reminder
                draggable
                grimData={grimData}
                settings={settings}
                setReminder={setReminder}
                reminderID={reminder.id}
                key={`${player.name}:${reminder.id}`}
                owner={player.name}
                x={reminder.x}
                y={reminder.y}
                onDblClick={() => {removeReminderFromPlayer(grimData, player.name, reminder.id)}}
            />);
        });
    });


    const addReminderMenu = useRef<GroupType >(null);
    const changeNameMenu = useRef<GroupType >(null);
    const changeCharacterMenu = useRef<GroupType >(null);

    return <div className="page grim">
        <br />
        <div id="stage-container">
            <Stage width={settings.grimWidth} height={settings.grimHeight}>
                <Layer id="background">
                    <Rect width={settings.grimWidth} height={settings.grimHeight} fill={settings.backgroundColour} cornerRadius={10} />
                </Layer>
                <Layer id="player-tokens">{playerTokens}</Layer>
                <Layer id="reminder-tokens">{reminderTokens}</Layer>
                <Layer id="menus">
                    {/* //* Add Reminder Menu */}
                    <Group
                        draggable
                        ref={addReminderMenu}
                        onDragMove={() => restrictRect(settings, addReminderMenu.current, 400, 300)}
                        id="add-reminder"
                        visible={isAddReminderVisible}
                        onDblClick={() => setIsAddReminderVisible(false)} onDblTap={() => setIsAddReminderVisible(false)}
                        x={50} y={100}
                    >
                        <Rect width={400} height={300} fill={settings.secondaryColour} cornerRadius={10} />
                        <Text x={4} y={4} text={`Add reminder to ${currentPlayer}`} fill={settings.secondaryTextColour} fontSize={16} fontFamily="Monaspace Radon" />
                        {reminderButtonElements}
                    </Group>

                    {/* //* Change Name Menu */}
                    <Group
                        draggable
                        ref={changeNameMenu}
                        onDragMove={() => restrictRect(settings, changeNameMenu.current, 240, 150)}
                        id="change-name"
                        visible={isChangeNameVisible}
                        onDblClick={() => setIsChangeNameVisible(false)} onDblTap={() => setIsChangeNameVisible(false)}
                        x={50} y={50}
                        >
                        <Rect width={240} height={150} fill={settings.secondaryColour} cornerRadius={10} />
                        <Text x={4} y={4} text={`Change name of ${currentPlayer}`} fill={settings.secondaryTextColour} fontSize={16} fontFamily="Monaspace Radon" />
                        <Html deriveVisibility>
                            <form action={(e: FormData) => {
                                const newName = e.get("changename-input")?.toString();
                                if (newName) {
                                    setPlayer(grimData, currentPlayer, {name: newName});
                                    setIsChangeNameVisible(false);
                                    setCurrentPlayer("none");
                                }
                            }}>
                                <input
                                    id="changename-input"
                                    name="changename-input"
                                    type="text" placeholder="John"
                                    onChange={(e) => {
                                        if (new RegExp(`^(${players.map((value) => {return value.name}).join("|")})$`).test(e.target.value)) { {/* //TODO explain regex in word */}
                                        e.target.setCustomValidity("Name already in use");
                                    } else {
                                        e.target.setCustomValidity("");
                                    }
                                    }}
                                    />
                                <br />
                                <input
                                    type="submit"
                                    value="Change Name"
                                    id="changename-submit"
                                    />
                            </form>
                        </Html>
                    </Group>

                    {/* //* Character Change Menu */}
                    <Group
                        draggable
                        ref={changeCharacterMenu}
                        onDragMove={() => restrictRect(settings, changeCharacterMenu.current, 240, 150)}
                        id="change-character"
                        visible={isChangeCharacterVisible}
                        onDblClick={() => setIsChangeCharacterVisible(false)}
                        x={50}
                        y={50}
                        >
                        <Rect width={400} height={400} fill={settings.secondaryColour} cornerRadius={10} />
                        <Text x={4} y={4} text={`Change Character of ${currentPlayer}`} fill={settings.secondaryTextColour} fontSize={16} fontFamily="Monaspace Radon" />
                        <Html deriveVisibility>
                            <div style={{position: "absolute", left: 10}}>
                                <CharacterSelectPane top={25} settings={settings} grimData={grimData} scale={0.65} maxWidth={6} effect={(e) => {
                                    setPlayer(grimData, currentPlayer, {character: e.currentTarget.id});
                                    setIsChangeCharacterVisible(false);
                                    setCurrentPlayer("none");
                                }}/>
                            </div>
                        </Html>
                    </Group>
                </Layer>
            </Stage>
        </div>
    </div>
}