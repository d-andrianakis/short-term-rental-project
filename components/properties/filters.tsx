import { useTranslations } from 'next-intl';

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useEffect, useState } from "react";

type FiltersProps = {
  loading: boolean;
  onFilter: (filter?: string) => void; // callback to parent
};

export default function Filters({ onFilter, loading }: FiltersProps) {
  const g = useTranslations("Global");
  const t = useTranslations("Properties");

  return (
    <>
      {loading ? (
        <div>{g('loading') ?? 'Loading...'}</div>
      ) : (
        <div>
          <div>
            <button onClick={() => onFilter("all")}>All</button>
            <RadioGroup defaultValue="option-one">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-one" id="option-one" onClick={() => onFilter("all")} />
                <Label htmlFor="option-one">Option One</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-two" id="option-two" onClick={() => onFilter("all")} />
                <Label htmlFor="option-two">Option Two</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <button onClick={() => onFilter("house")}>Houses</button>
            <Select onValueChange={() => onFilter("house")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <button onClick={() => onFilter("apartment")}>Apartments</button>
          </div>
        </div>
      )}
    </>
  );
}
