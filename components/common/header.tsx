"use client";

import { useIsMobile } from "@/hooks/use-mobile"

import { useTranslations } from 'next-intl';
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Search as SearchIcon } from 'lucide-react';

import { TextAlignStartIcon } from '@/components/ui/icons/lucide-text-align-start';
import SignoutButton from "@/components/common/signout";
import { ModeToggle } from "@/components/common/mode-toggle";
import Search from "@/components/common/search";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from '@/components/LanguageSwitcher';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion"

export default function Header() {
    const g = useTranslations("Global");

    const [openItem, setOpenItem] = useState<string | undefined>("");
    const mobileAccordionName = "mobile-search-accordion";

    const { theme, systemTheme } = useTheme();
    const isMobile = useIsMobile()

    const currentTheme = theme === "system" ? systemTheme : theme;

  // Choose the logo based on theme
  const logoSrc =
    currentTheme === "dark"
      ? "/assets/common/logo-dark.png"
      : "/assets/common/logo-light.png";
    const menuToggleColor =
        theme === "dark" ? "white" : "black";

    // Mobile template (below 768px)
    const MobileLayout = (
        <header className="p-4 bg-primary-foreground text-white">
            <div className="container mx-auto flex flex-col items-center gap-3">
                <div className="w-full flex items-end">
                    <div className="w-2/12">
                        <Sheet>
                            <SheetTrigger>
                                <TextAlignStartIcon color={ menuToggleColor }/>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[90vw] border-r-0">
                                <SheetHeader>
                                <SheetTitle>{ g('menu') }</SheetTitle>
                                <SheetDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
                                </SheetDescription>
                                </SheetHeader>
                                <div className="px-4">
                                    <SignoutButton />
                                    <ModeToggle />
                                </div>
                                <div className="px-4">
                                    <LanguageSwitcher />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                    <div className="w-8/12 flex justify-center">
                        <Link href="/" className="block">
                            <Image src={logoSrc} width={100} height={100} alt="logo" />
                        </Link>
                    </div>
                    <div className="w-2/12 flex justify-end">
                        <Button 
                            size="icon" 
                            className="size-9"
                            onClick={() =>
                                setOpenItem(openItem === mobileAccordionName ? undefined : mobileAccordionName)
                            }
                            >
                            <SearchIcon/>
                        </Button>
                    </div>
                </div>

                <div className="w-full">                    
                    <Accordion 
                        type="single"
                        collapsible
                        value={openItem}
                        onValueChange={setOpenItem}
                    >
                        <AccordionItem value={ mobileAccordionName }>
                            <AccordionContent>
                                <Search className="flex-col w-full"/>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </header>
    );

    // Desktop template (768px and up)
    const DesktopLayout = (
        <header className="p-4 bg-primary-foreground text-white">
            <div className="flex items-center container mx-auto">
                <div className="w-1/4 self-end">
                    <Link href="/">
                        <Image src={logoSrc} width={100} height={100} alt="logo" />
                    </Link>
                </div>
                <div className="w-1/2 self-end">
                    <Search />
                </div>
                <div className="w-1/4 flex justify-end gap-2 self-end">
                    <LanguageSwitcher />
                    <ModeToggle />
                </div>
            </div>
        </header>
    );

    return isMobile ? MobileLayout : DesktopLayout;
}