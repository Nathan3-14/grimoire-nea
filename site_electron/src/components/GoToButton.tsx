import { NavLink } from "react-router-dom";
import type { ButtonProps } from "./Button";
import Button from "./Button";

interface GoToButtonProps extends ButtonProps {
    to: string
}

export default function GoToButton({children, settings, to, ...rest}: GoToButtonProps) {
    return <NavLink to={to}><Button settings={settings} {...rest}>{children}</Button></NavLink>
}