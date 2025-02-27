"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <div className="pt-3 pb-6 px-6 w-full flex flex-row justify-between items-center">
      <Link href="/" className="flex items-center">
        <Image
          src="/Small-Logo.png"
          alt="Book Sage Logo"
          width={112}
          height={36}
          className="w-28 object-cover rounded-lg hover:cursor-pointer"
        />
      </Link>

      {/* Navigation Links */}
      <div className="flex flex-row gap-6 text-lg">
        <Link
          href="/"
          className={`hover:underline ${
            pathname === "/" ? "underline font-semibold" : ""
          }`}
        >
          Home
        </Link>
        <Link
          href="/about"
          className={`hover:underline ${
            pathname === "/about" ? "underline font-semibold" : ""
          }`}
        >
          About
        </Link>
      </div>
    </div>
  );
}
