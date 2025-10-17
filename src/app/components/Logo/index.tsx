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
          className="w-32 h-auto md:w-[100px]"
          sizes="(max-width: 768px) 158px, 100px"
          priority
        />
      </Link>
    </div>
  );
};

export default Logo;
