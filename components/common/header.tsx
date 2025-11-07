"use client";

import Link from "next/link";
import Image from "next/image";
import SignoutButton from "@/components/common/signout";
import { ModeToggle } from "@/components/common/mode-toggle";
import Search from "@/components/common/search";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Header() {
    const { theme } = useTheme();
    const [isMobile, setIsMobile] = useState<boolean>(() =>
        typeof window !== "undefined" ? window.innerWidth < 768 : false
    );

    const logoSrc =
        theme === "dark" ? "/assets/common/logo-dark.png" : "/assets/common/logo-light.png";

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mq = window.matchMedia("(max-width: 767px)");
        const handleChange = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);

        // set initial state (matchMedia may not fire immediately in some browsers)
        handleChange(mq);

        if (mq.addEventListener) {
            mq.addEventListener("change", handleChange as EventListener);
        } else {
            mq.addListener(handleChange);
        }

        return () => {
            if (mq.removeEventListener) {
                mq.removeEventListener("change", handleChange as EventListener);
            } else {
                mq.removeListener(handleChange);
            }
        };
    }, []);

    // Mobile template (below 768px)
    const MobileLayout = (
        <header className="p-4 bg-primary-foreground text-white">
            <div className="container max-[1600px]:px-5 mx-auto flex flex-col items-center gap-3">
                <Link href="/" className="block">
                    <Image src={logoSrc} width={90} height={90} alt="logo" />
                </Link>

                <div className="w-full px-2">
                    <Search />
                </div>

                <div className="flex gap-2">
                    <SignoutButton />
                    <ModeToggle />
                </div>
            </div>
        </header>
    );

    // Desktop template (768px and up)
    const DesktopLayout = (
        <header className="p-4 bg-primary-foreground text-white">
            <div className="flex items-center container max-[1600px]:px-5 mx-auto">
                <div className="w-1/4 self-end">
                    <Link href="/">
                        <Image src={logoSrc} width={100} height={100} alt="logo" />
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

    return isMobile ? MobileLayout : DesktopLayout;
}