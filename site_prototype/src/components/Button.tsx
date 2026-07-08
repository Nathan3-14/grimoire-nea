import { useEffect, useState, type ReactNode } from "react"
import { type Settings } from "../App"
import { hsl } from "../funcs";
import styles from "./Button.module.css"


export default function Button({children, settings, ...rest}: {children: ReactNode,settings: Settings}) {
    const [borderColour, setBorderColour] = useState(settings.textColour);

    useEffect(() => {
        setBorderColour(settings.textColour);
    }, [settings.textColour]);

    return <button
        className={styles.button}
        style={{border: `2px solid ${borderColour}`}}
        onMouseEnter={() => setBorderColour(hsl(borderColour)[2] > 40 ? "#cccccc" : "#808080")}
        onMouseLeave={() => setBorderColour(settings.textColour)}
        {...rest}>
        {children}
    </button>
}