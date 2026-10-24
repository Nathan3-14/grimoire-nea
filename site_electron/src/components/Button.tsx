import { useEffect, useState, type ComponentPropsWithoutRef } from "react"
import { type Settings } from "../App"
import { hsl } from "../funcs";
import styles from "./Button.module.css"

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
    settings: Settings;
    secondary?: boolean;
}

export default function Button({children, settings, style, secondary, ...rest}: ButtonProps) {
    const [borderColour, setBorderColour] = useState(settings.textColour);
    const textColour = secondary ? settings.secondaryTextColour : settings.textColour;

    useEffect(() => {
        setBorderColour(textColour);
    }, [textColour]);

    return <button
        className={styles.button}
        style={{border: `2px solid ${borderColour}`, color: borderColour, ...style}}
        onMouseEnter={() => setBorderColour(hsl(borderColour)[2] > 40 ? "#cccccc" : "#808080")}
        onMouseLeave={() => setBorderColour(textColour)}
        {...rest}>
        {children}
    </button>
}