'use client';
import { LogOut } from "@/actions/log-out";

const LogOutButton = () => {
    const handleClick = () => {
         LogOutButton();
    }
    return (
        <button onClick={handleClick} className="button-secondary">Log Out</button>
    )
}

export default LogOutButton;