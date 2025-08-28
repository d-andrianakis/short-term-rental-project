"use client";

import { Input } from "@/components/ui/input";

import { useQueryState } from "nuqs";

export default function Search() {
    const [city, setCity] = useQueryState("city", { defaultValue: "" });

    return (
        <Input type="text" value={city} onChange={(e) => setCity(e.target.value || null)} placeholder="Search..." className="w-full max-w-md" />
    )
}