import Link from "next/link"
import Image from "next/image"

const Logo =() => {
    return (
      <div className="flex flex-row">
        <Link href="/" className="">
          <Image src="/logo-b.png" alt="Logo" width={100} height={100} />
        </Link>
      </div>
    );
}

export default Logo