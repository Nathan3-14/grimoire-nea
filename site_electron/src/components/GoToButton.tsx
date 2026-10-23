import { NavLink, useNavigate } from "react-router-dom";
import type { ButtonProps } from "./Button";
import Button from "./Button";

interface GoToButtonProps extends ButtonProps {
    to: string | number
}

export default function GoToButton({children, settings, to, ...rest}: GoToButtonProps) {
    const navigate = useNavigate();
    
    if (typeof to == "number") {
        return <Button settings={settings} {...rest} onClick={() => navigate(to)}>{children}</Button>
    }
    return <NavLink to={to}><Button settings={settings} {...rest}>{children}</Button></NavLink>
}