import type { Settings } from "../App";
import { useState, type ReactElement } from "react";
import { angleFromIndex } from "../funcs";
import roleData from "../botc_roles.json";
import type { KonvaEventObject, NodeConfig, Node as NodeType } from "konva/lib/Node";
import type { Layer as LayerType} from "konva/lib/Layer"
import { Stage, Layer, Rect, Group, Text } from "react-konva";
import { Player, type NewPlayerProperties, type PlayerProperties } from "../components/Player";
import { Reminder, type NewReminderProperties, type ReminderProperties } from "../components/Reminder";


type KonvaEvent = KonvaEventObject<MouseEvent, NodeType<NodeConfig>>;

const getCharacterData = (characterID: string) => {
    let output = roleData[0];
    roleData.forEach((value) => {
        if (value.id == characterID) {output = value}
    })
    return output;
}

export default function Grim({settings}: {settings: Settings}) {
    const script = ["imp", "scarletwoman", "baron", "spy", "poisoner", "drunk", "saint", "butler", "recluse", "washerwoman", "librarian", "investigator", "chef", "empath", "fortuneteller", "soldier", "monk", "mayor", "slayer", "virgin", "ravenkeeper", "undertaker"]
    const reminderButtonElements: ReactElement[] = [];
    let index = 0;
    //* Iterate through all characters and their reminders (supplied from https://release.botc.app/resources/data/roles.json (https://release.botc.app/resources))
    script.forEach((characterID) => {
        const characterData = getCharacterData(characterID);

        //* Combine all lists of reminders from possible locations
        //? Some characters have global reminders so they need to be added if present
        let allReminders = characterData.reminders;
        if (characterData.remindersGlobal) {
            allReminders = [...allReminders, ...characterData.remindersGlobal]; //? joins the two arrays together
        }
        //* Iterate through all of each characters reminder tokens
        allReminders.forEach((reminderText) => {
            reminderButtonElements.push(<Reminder
                settings={settings}
                reminderID={`${characterID}.${reminderText}`}
                x={(index % 5) * 60} y={Math.floor(index / 5) * 70 + 30}
                onClick={(e: KonvaEvent) => {
                    console.log(`Adding ${characterID}.${reminderText} to ${currentPlayer}`);
                    setIsAddReminderVisible(false);
                    console.info("Before .getStage()");
                    const stage = e.currentTarget.getStage();
                    console.info("After .getStage()");
                    if (!stage) {return}
                    
                    console.info("Before .findOne()s");
                    const reminderLayer: LayerType|undefined = stage.findOne("#reminder-tokens");
                    const playerLayer: LayerType|undefined = stage.findOne("#player-tokens");
                    const currentPlayerElement = playerLayer?.findOne(`#${currentPlayer}`);
                    if (!reminderLayer || !playerLayer || !currentPlayerElement) {return}
                    console.info("After .findOne()s");
                    addReminderToPlayer(currentPlayer, `${characterID}.${reminderText}`);


                    // reminderLayer.add(<Reminder
                    //     draggable
                    //     x={currentPlayerElement.x()}
                    //     y={currentPlayerElement.y()}
                    // />);
                    // reminderLayer.add(<Circle x={100} y={50} radius={10} fill="red" />);
                    // reminderLayer.add(<Reminder
                    //     draggable
                    //     settings={settings}
                    //     reminderID={`${characterID}.${reminderText}`}
                    //     x={50}
                    //     y={50}
                    // />);
                    //TODO Add <Reminder...> to reminders layer on top of gary? or specific distance inwards
                    //TODO Make settings persistant across pages
                }}
            />);
            index++;
        });
    });

    const [players, setPlayers] = useState<PlayerProperties[]>([
        {character: "washerwoman", name: "Alice", x: 0, y: 0, isMenuOpen: false, reminders: []},
        {character: "librarian", name: "Bob", x: 0, y: 0, isMenuOpen: false, reminders: []},
        {character: "investigator", name: "Carol", x: 0, y: 0, isMenuOpen: false, reminders: []},
        {character: "poisoner", name: "David", x: 0, y: 0, isMenuOpen: false, reminders: []},
        {character: "imp", name: "Edith", x: 0, y: 0, isMenuOpen: false, reminders: []},
        {character: "ravenkeeper", name: "Freya", x: 0, y: 0, isMenuOpen: false, reminders: []},
        {character: "monk", name: "Gary", x: 0, y: 0, isMenuOpen: false, reminders: []}
    ]);
    const getPlayer = (name: string) => {
        let playerIndex = 0;
        players.forEach((value, index) => {
            if (value.name == name) {
                playerIndex = index;
            }
        })
        return players[playerIndex]
    }

    //! Update when new properties are added
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
                if (properties.isMenuOpen !== undefined) {tempPlayer.isMenuOpen = properties.isMenuOpen}
                if (properties.reminders) {tempPlayer.reminders = properties.reminders}
            }
            newPlayers.push(tempPlayer);
        });
        setPlayers(newPlayers);
    };
    const addReminderToPlayer = (playerName: string, reminderID: string) => {
        //* Check if reminder already exists on this player
        let reminderAlreadyExists = false;
        getPlayer(playerName).reminders.forEach((value) => {
            if (value.id == reminderID) {reminderAlreadyExists = true};
        });
        if (reminderAlreadyExists) {return}

        //? adds the item {id: reminderId...} to all other reminders the player has
        setPlayer(playerName, {reminders: [...getPlayer(playerName).reminders, {id: reminderID, x: 50, y: 50}]});
    };
    //! Update when new properties are added
    const setReminder = (playerName: string, reminderID: string, properties: NewReminderProperties) => {
        const newReminders: ReminderProperties[] = [];
        getPlayer(playerName).reminders.forEach((reminder) => {
            const tempReminder = reminder;
            if (reminder.id == reminderID) {
                if (properties.id) {tempReminder.id = properties.id}
                if (properties.x) {tempReminder.x = properties.x}
                if (properties.y) {tempReminder.y = properties.y}
            };
            newReminders.push(reminder);
        });
        setPlayer(playerName, {reminders: newReminders})
    };
    
    const [currentPlayer, setCurrentPlayer] = useState("initial"); //* Player Element's ID
    const [isAddReminderVisible, setIsAddReminderVisible] = useState(false);
    const changeCursor = (e: KonvaEvent, cursor: string) => {
        const stage = e.target.getStage();
        if (!stage) {return}
        stage.container().style.cursor = cursor;
    }
    const functions = {
        setCurrentPlayer: setCurrentPlayer,
        setIsAddReminderVisible: setIsAddReminderVisible,
        changeCursor: changeCursor
    };

    const playerTokens = players.map((player) => {
        return <Player
            character={player.character}
            name={player.name}
            x={player.x}
            y={player.y}
            isMenuOpen={player.isMenuOpen}
            settings={settings}
            setPlayer={setPlayer}
            functions={functions}
        />
    });

    const reminderTokens: ReactElement[] = [];
    players.forEach((player) => {
        player.reminders.forEach((reminder) => {
            reminderTokens.push(<Reminder
                draggable
                settings={settings}
                setReminder={setReminder}
                reminderID={reminder.id}
                owner={player.name}
                x={reminder.x}
                y={reminder.y}
            />);
        });
    });


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
        <Layer id="player-tokens">{playerTokens}</Layer>
        <Layer id="reminder-tokens">{reminderTokens}</Layer>
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