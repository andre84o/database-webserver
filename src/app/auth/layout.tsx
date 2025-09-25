import Logo from "../components/Logo";

const AuthLayout = ({ 
    children, 
}: Readonly <{ 
        children: React.ReactNode; 
    }>) => {
    return (
            <>
            
             <header className="flex justify-between items-center flex-wrap">
                <Logo />
            </header>
            {children}
        
        </>
    )
}

export default AuthLayout
