"use client";

import { Input } from "@/components/ui/input";
import { DateTimePicker24hForm } from "@/components/ui/datetime-picker-24h";

import { useQueryState } from "nuqs";

export default function Search() {
    const [city, setCity] = useQueryState("city", { defaultValue: "" });

    return (
        <>
            <div className="w-fit flex">
                <Input type="text" value={city} onChange={(e) => setCity(e.target.value || null)} placeholder="Search..." className="min-w-52 max-w-md" />
                <DateTimePicker24hForm />
            </div>
        </>  
    )
}