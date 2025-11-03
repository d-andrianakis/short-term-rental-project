import Link from "next/link";
import SignoutButton from "@/components/common/signout";
import { ModeToggle } from "@/components/common/mode-toggle";
import Search from "@/components/common/search";

export default function Header() {
    return (
        <header className="p-4 bg-primary-foreground text-white">
            <div className="flex items-center container max-[1600px]:px-5 mx-auto">
                <div className="w-1/4 self-end">
                    <h1 className="text-2xl text-primary">
                        <Link href="/">
                            Home
                        </Link>
                    </h1>
                </div>
                <div className="w-1/2">
                    <Search />
                </div>
                <div className="w-1/4 flex justify-end gap-2 self-end">
                    <SignoutButton />
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}