import convert from 'color-convert';
import type { Settings } from './App';
import { GrimData } from './pages/NewGrim';
import { NewPlayerProperties, PlayerProperties } from './components/Player';
import { setTheme } from './pages/Settings';

const TAU = 2 * Math.PI;
export const angleFromIndex = (index: number, max: number) => {
    return (index / max) * TAU + Math.PI;
}

export const checkCircleInsideGrim = (
    position: {x: number, y: number},
    diameter: number,
    settings: Settings,
    results: {
        left: CallableFunction,
        right: CallableFunction,
        top: CallableFunction,
        bottom: CallableFunction
    }
) => {
    if (position.x < 0) {results.left()}
    if (position.y < 0) {results.top()}
    if ((position.x + diameter) > settings.grimWidth) {results.right()}
    if ((position.y + diameter) > settings.grimHeight) {results.bottom()}
}

export const hsl = (colour: string) => {return convert.hex.hsl(colour)};

export const getCharacterIcon = (name: string) => {
    const filename = `${name.replace("_", "").replace("'", "").replace("-", "")}.png`;
    const url = `https://raw.githubusercontent.com/tomozbot/botc-icons/refs/heads/main/PNG/${filename}`;
    return url
}

//! Update when new properties are added
export const setPlayer = (grimData: GrimData, name: string|undefined, properties: NewPlayerProperties) => {
    if (!name) {return}

    const newPlayers: PlayerProperties[] = []; 
    grimData.players.forEach((player) => {
        const tempPlayer = player;
        if (player.name == name) {
            console.log(`Settings ${properties} for ${name}`);
            if (properties.character) {tempPlayer.character = properties.character}
            if (properties.name) {tempPlayer.name = properties.name}
            if (properties.x) {tempPlayer.x = properties.x}
            if (properties.y) {tempPlayer.y = properties.y}
            if (properties.isMenuOpen !== undefined) {tempPlayer.isMenuOpen = properties.isMenuOpen}
            if (properties.reminders) {tempPlayer.reminders = properties.reminders}
            if (properties.isDead !== undefined)  {tempPlayer.isDead = properties.isDead}
        }
        newPlayers.push(tempPlayer);
    });
    grimData.setPlayers(newPlayers);
};

export const setLocalStorage = (key: string, inputObject: any) => {
    localStorage.setItem(key, JSON.stringify(inputObject));
}

export const getFromLocalStorage = (key: string, defaultValue?: any) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
}

export const loadSettings = (settings: Settings) => {
    const colourTheme = getFromLocalStorage("colour-theme", "-1");
    console.info(colourTheme);
    if (colourTheme == "-1") {
        setTheme(settings, "darkred");
    } else if (colourTheme != "custom") {
        console.info(`Setting to ${colourTheme}`)
        setTheme(settings, colourTheme);
    } else {
        setTheme(settings, "custom")

        settings.setBackgroundColour(getFromLocalStorage("background-colour", "-1"));
        settings.setTextColour(getFromLocalStorage("text-colour", "-1"));
        settings.setLinkColour(getFromLocalStorage("link-colour", "-1"));
        settings.setSecondaryColour(getFromLocalStorage("secondary-colour", "-1"));
        settings.setSecondaryTextColour(getFromLocalStorage("secondary-text-colour", "-1"));

        settings.setTokenBackgroundColour(getFromLocalStorage("token-background-colour", "-1"));
        settings.setTokenTextColour(getFromLocalStorage("token-text-colour", "-1"));
    }

    settings.setTokenSize(+getFromLocalStorage("token-size", 100));
    settings.setinitialTokenCircleRadius(+getFromLocalStorage("token-circle-radius", 190));
}

export const saveSetting = (settingID: string, value: any) => {
    setLocalStorage(settingID, value);
}

function sortLoop(currentList: any[], reverse?: boolean): any[] {
    let workingList: any[] = [];

    let currentIndex = 0;

    while (currentIndex < currentList.length) {
        const value = currentList[currentIndex];
        let newItem: any[] = [];

        if (currentIndex+1 >= currentList.length) {
            newItem = value;
        } else {

            const a = value;
            const b = currentList[currentIndex+1]
            
            let aIndex = 0;
            let bIndex = 0;
            while (aIndex < a.length || bIndex < b.length) {
                const aValue = a[aIndex];
                const bValue = b[bIndex];
                console.info(`a: ${aIndex} => ${aValue}`);
                console.info(`b: ${bIndex} => ${bValue}`);
    
                if (aIndex == a.length) {
                    newItem = [...newItem, bValue];
                    bIndex++;
                    continue;
                }
                if (bIndex == b.length) {
                    newItem = [...newItem, aValue];
                    aIndex++;
                    continue;
                }
    
                if (aValue > bValue) {
                    if (reverse) {
                        newItem = [...newItem, aValue];
                        aIndex++
                    } else {
                        newItem = [...newItem, bValue];
                        bIndex++;
                    }
                } else {
                    if (reverse) {
                        newItem = [...newItem, bValue]
                        bIndex++;
                    } else {
                        newItem = [...newItem, aValue];
                        aIndex++;
                    }
                }
            };
        }

        workingList = [...workingList, newItem];
        console.log(newItem);
        console.log(JSON.stringify(workingList));
        currentIndex += 2;
        console.info(`currentIndex: ${currentIndex} currentLenght: ${currentList.length}`);
    }
    return workingList;
}

export function sort(list: number[], reverese?: boolean): number[];
export function sort(list: string[], reverse?: boolean): string[];
export function sort(list: any[], reverse?: boolean) {
    let currentList = list.map((value) => {return [value]});
    while (currentList.length > 1) {
        currentList = sortLoop(currentList, reverse);
        console.info(`New loop from ${JSON.stringify(currentList)}`);
        console.log(currentList.length);
    }
    console.log("quit");

    return currentList[0]
}
