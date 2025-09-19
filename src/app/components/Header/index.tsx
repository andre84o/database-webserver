// Fil: src/components/Header.tsx
import Image from "next/image";
import Link from "next/link";
import Navigation from "../Navigation";
import Logo from "../Logo";
import AccountLinks from "../AccountLinks";

export default function Header() {
  return (
    <>
      <header className="flex justify-between items-center flex-wrap">
        <Logo />
        <AccountLinks />
        <button className="button-tertiary">Test</button>
      </header>
      <div className="mt-4 mx-auto w-[80%] border-b-4"></div>
    </>
  );
}
