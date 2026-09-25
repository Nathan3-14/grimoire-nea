import { ComponentPropsWithoutRef } from "react";
import type { Settings } from "../App";
import GoToButton from "../components/GoToButton";
import "./Credits.css"

export default function Credits({settings}: {settings: Settings}) {
    const Link = ({children, ...rest}: ComponentPropsWithoutRef<"a">) => {return <a style={{color: settings.linkColour}} {...rest}>{children}</a>}

    return <div className="page credits">
        <h1>Credits</h1>
        <GoToButton to="/" settings={settings}>Home</GoToButton>
    
        <br />
        <div className="credits-list">
            <p>This application is not affiliated with The Pandemonium Institute.<br />All roles and characters are the property of Steven Medway and The Pandemonium Institute.<br />Blood on the Clocktower is a trademark of Steven Medway and The Pandemonium Institute.</p>
            <p>Character Icons are from Tomozbot's botc-icons on <Link href="https://www.github.com/tomozbot/botc-icons/">Github</Link>.</p>
            <p>Papyrus, Monaspace Radon and Old English Text MT fonts as provided by <Link href="https://www.online-fonts.com">online-fonts.com</Link></p>
            <p>Fredoka font provided by <Link href="https://fonts.google.com/">Google Fonts</Link></p>
        </div>
    </div>
}