import SignoutButton from "@/components/common/signout";
import Link from "next/link";

export default function Header() {
    return (
        <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1 className="text-2xl">My App</h1>
        <nav>
            <ul className="flex space-x-4">
            <li>
                <Link href="/" className="hover:text-gray-400">
                Home
                </Link>
            </li>
            <li>
                <Link href="/about" className="hover:text-gray-400">
                About
                </Link>
            </li>
            <li>
                <Link href="/contact" className="hover:text-gray-400">
                Contact
                </Link>
            </li>
            </ul>
        </nav>
        <SignoutButton />
        </header>
    );
}