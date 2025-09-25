const LogOutButton = () => {
    const handleClick = async () => {
        await LogOutButton();
    }
    return (
        <button onClick={handleClick} className="button-secondary">Log Out</button>
    )
}

export default LogOutButton;