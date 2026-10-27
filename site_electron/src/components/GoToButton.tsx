import { NavLink, useNavigate } from "react-router-dom";
import type { ButtonProps } from "./Button";
import Button from "./Button";

interface GoToButtonProps extends ButtonProps {
    to: string
}

export default function GoToButton({children, settings, to, ...rest}: GoToButtonProps) {
    const navigate = useNavigate();
    
    if (to == "-1") {
        return <Button settings={settings} {...rest} onClick={() => {
            navigate(-1);
        }}>{children}</Button>
        //TODO Fix duplicate reminders having same keys, add index with separation character?
    }
    return <NavLink to={to}><Button settings={settings} {...rest}>{children}</Button></NavLink>
}