"use client";

import { SearchForm } from "@/components/ui/search-form";

interface SearchProps {
  className?: string;
}

export default function Search({ className = "" }: SearchProps) {
  return (
    <div className="w-full flex">
      <SearchForm className={ className }/>
    </div>
  );
}
