import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="w-full flex justify-between bg-primary p-2">
      <div></div>
      <div className="flex gap-10 justify-end">
        {/* <ClickableLink href="/profile">
          
        </ClickableLink> */}
        <Link href="/profile">
          <a>
            <Image
              className="rounded-full bg-accent p-1 cursor-pointer"
              src="https://avatars.dicebear.com/api/personas/Olyno.svg"
              width={45}
              height={45}
            />
          </a>
        </Link>
      </div>
    </nav>
  );
};
