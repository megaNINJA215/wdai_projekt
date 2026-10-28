"use client";

import { redirect } from "next/navigation";
import SearchAutocomplete from "./SearchAutocomplete";
import SearchInput from "./SearchInput";
import { useEffect, useRef, useState } from "react";

export default function Searchbar() {
  const [searchValue, setSearchValue] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropDownRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropDownRef, inputRef]);

  return (
    <div className="flex flex-col items-center gap-2 w-full relative max-w-200">
      <SearchInput
        label="Szukaj..."
        onChange={(e) => {
          setSearchValue(e.target.value);
          setShowAutocomplete(e.target.value.length > 0);
        }}
        value={searchValue}
        ref={inputRef}
        onFocus={() => setShowAutocomplete(searchValue.length > 0)}
        onSearch={() => {
          if (searchValue.trim().length > 0) {
            setShowAutocomplete(false);
            redirect(`/search?query=${encodeURIComponent(searchValue)}`);
          }
        }}
      />
      {searchValue.length > 0 && <SearchAutocomplete
        setSearchValue={setSearchValue}
        query={searchValue}
        ref={dropDownRef}
        show={showAutocomplete}
      />}
    </div>
  );
};