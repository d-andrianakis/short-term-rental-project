"use client";

import Link from "next/link";
import Image from "next/image";
import SignoutButton from "@/components/common/signout";
import { ModeToggle } from "@/components/common/mode-toggle";
import Search from "@/components/common/search";
import { useTheme } from "next-themes";

export default function Header() {
    const { theme } = useTheme();

    const logoSrc =
    theme === "dark" ? "/assets/common/logo-dark.png" : "/assets/common/logo-light.png";

    return (
        <header className="p-4 bg-primary-foreground text-white">
            <div className="flex items-center container max-[1600px]:px-5 mx-auto">
                <div className="w-1/4 self-end">
                    <Link href="/">
                        <Image
                        src={logoSrc}
                        width={100}
                        height={100}
                        alt="logo"
                        />
                    </Link>
                </div>
                <div className="w-1/2 self-end">
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