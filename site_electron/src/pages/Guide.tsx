import type { Settings } from "../App"
import "./Guide.css"

export default function Home({settings}: {settings: Settings}) {
    const thickBorder = {border: `3px ${settings.textColour} solid`};

    const pageContent = {
        "setup": <ol style={{backgroundColor: settings.secondaryColour, color: settings.secondaryTextColour}}>
            <li>Select a Script: Trouble Brewing, Bad Moon Rising, Sects and Violets or<br />a custom script</li>
            <li>Select your player count (5-15)</li>
            <li>Select your layout: Circle or None</li>
        </ol>,
        "script-select": <ol style={{backgroundColor: settings.secondaryColour, color: settings.secondaryTextColour}}>
            <li>Select whether you are using a .json file or a url</li>
            <li>If you are uploading a .json file, press the "Choose File" button</li>
            <li>If you are using a URL, paste it in the text box</li>
        </ol>,
        "character-select": <>
            <p>
                Select your desired characters, with the counts stated below.<br />
                Please remember to take into account any characters' setup effects.
            </p>
            <table cellSpacing={0} style={{border: `3px ${settings.textColour} solid`}} rules={"rows"}>
                <thead style={thickBorder}>
                    <tr style={{backgroundColor: settings.secondaryColour, color: settings.secondaryTextColour}}>
                        <td style={thickBorder}>Player Count</td>
                        {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((playerCount) => {return <td>{playerCount}</td>})}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={thickBorder}>Townsfolk</td>
                        <td>3</td><td>3</td><td>5</td><td>5</td><td>5</td><td>7</td><td>7</td><td>7</td><td>9</td><td>9</td><td>9</td>
                    </tr>
                    <tr>
                        <td style={thickBorder}>Outsiders</td>
                        <td>0</td><td>1</td><td>0</td><td>1</td><td>2</td><td>0</td><td>1</td><td>2</td><td>0</td><td>1</td><td>2</td>
                    </tr>
                    <tr>
                        <td style={thickBorder}>Minions</td>
                        <td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>2</td><td>2</td><td>2</td><td>3</td><td>3</td><td>3</td>
                    </tr>
                    <tr>
                        <td style={thickBorder}>Demons</td>
                        <td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td>
                    </tr>
                </tbody>
            </table>
        </>,
        "grim": <>
            <p>
                Double-clicking on a player opens the menu for that player.<br />
                Clicking these options opens the corresponding menu
            </p>
        </>
    };

    const pages = ["setup", "script-select", "character-select", "grim"] as const;
    const buttonElements = pages.map((pageName) => {
        return <button
            id={`${pageName}-button`}
            style={
                settings.selectedGuide == pageName ? {
                    backgroundColor: settings.secondaryTextColour,
                    color: settings.secondaryColour
                } : {
                    backgroundColor: settings.secondaryColour,
                    color: settings.secondaryTextColour
                }
            }
            onClick={() => {settings.setSelectedGuide(pageName)}}
        >{pageName}</button>
    });
    const pageElements = pages.map((pageName) => {
        return <div id={pageName} style={{display: settings.selectedGuide == pageName ? "initial": "none"}}>
            {pageContent[pageName]}
        </div>
    });

    return <div className="page guide">
        <h1>Guide</h1>
        <div id="tab-select">
            {buttonElements}
        </div>
        {pageElements}
    </div>
}