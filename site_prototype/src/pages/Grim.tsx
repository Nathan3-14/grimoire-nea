import type { Settings } from "../App";
import { useState, type ReactElement } from "react";
import { angleFromIndex } from "../funcs";
import roleData from "../botc_roles.json";
import type { KonvaEventObject, NodeConfig, Node as NodeType } from "konva/lib/Node";
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
                onClick={() => {
                    setIsAddReminderVisible(false);
                    addReminderToPlayer(currentPlayer, `${characterID}.${reminderText}`);

                    //TODO Make settings persistant across pages
                    //TODO Add death shrouds (same placement as reminders)
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

        const player = getPlayer(playerName);
        //? Changes player position so the centre of the screen is (0,0)
        //? settings.halfTokenSize is added as the location of each player is where its top left corner is
        const modifiedPosition = {
            x: player.x-(settings.grimWidth/2)+settings.halfTokenSize,
            y: -(player.y-(settings.grimHeight/2)+settings.halfTokenSize)
        };

        const playerDistance = Math.sqrt(modifiedPosition.x**2 + modifiedPosition.y**2);
        const reminderDistance = 0.6 * playerDistance;
        const theta = Math.atan(modifiedPosition.x/modifiedPosition.y) + (modifiedPosition.y <= 0 ? Math.PI : 0);
        const newReminderX = reminderDistance * Math.sin(theta) + (settings.grimWidth / 2);
        const newReminderY = reminderDistance * Math.cos(theta) + (settings.grimHeight / 2);
        setPlayer(playerName, {reminders: [
            //? adds the item '{id: reminderId...}' to all other reminders the player has
            ...getPlayer(playerName).reminders,
            {
                id: reminderID,
                x: newReminderX - settings.halfReminderSize, //? Correct for top left positioning
                y: settings.grimHeight - newReminderY - settings.halfReminderSize //? Correct for top left positioning and revert back to normal coordinates
            }
        ]});
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
            newReminders.push(tempReminder);
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
        return <>
            <Player
            character={player.character}
            name={player.name}
            x={player.x}
            y={player.y}
            isMenuOpen={player.isMenuOpen}
            settings={settings}
            setPlayer={setPlayer}
            functions={functions}
            />
        </>
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
                x: settings.initialTokenCircleRadius * Math.sin(angleFromIndex(index, players.length)) - settings.halfTokenSize + (settings.grimWidth / 2),
                y: settings.initialTokenCircleRadius * Math.cos(angleFromIndex(index, players.length)) - settings.halfTokenSize + (settings.grimHeight / 2)
            });
            setCurrentPlayer("none");
        })
    }

    return <Stage width={settings.grimWidth} height={settings.grimHeight}>
        <Layer id="background">
            <Rect width={settings.grimWidth} height={settings.grimHeight} fill={settings.backgroundColour} cornerRadius={10} />
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