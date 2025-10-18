import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex flex-row">
      <Link href="/">
        <Image
          src="/logo-b.png"
          alt="Logo"
          width={100}
          height={100}
          className="w-[120px] h-auto md:w-32"
          sizes="(max-width: 768px) 100px, 128px"
          priority
        />
      </Link>
    </div>
  );
};

export default Logo;
