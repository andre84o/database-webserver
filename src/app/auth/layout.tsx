import Logo from "../components/Logo";

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <header className="flex items-center justify-center sm:justify-between flex-wrap shadow-md p-4 mb-8 bg-white shadow-xl shadow-[#735BFD]">
        <Logo />
      </header>
      {children}
    </>
  );
};

export default AuthLayout;
