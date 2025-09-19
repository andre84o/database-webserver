import Link from "next/link"
import Image from "next/image"

const Logo =() => {
    return (
      <Link href="/" className="button-primary">
        Dadabase
        {/* <Image src="/social-media.png" alt="Logo" width={50} height={50} /> */}
      </Link>
    );
}

export default Logo