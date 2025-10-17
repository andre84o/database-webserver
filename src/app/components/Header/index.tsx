import Image from "next/image";
import Link from "next/link";
import Navigation from "../Navigation";
import Logo from "../Logo";
import AccountLinks from "../AccountLinks";
import SearchInput from "../Search";


export default function Header() {
  return (
    <>
      <header className="flex justify-between items-center flex-wrap">
        <Logo />
        <SearchInput />
        <AccountLinks />
      </header>
    </>
  );
}
