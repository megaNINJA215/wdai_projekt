import { redirect } from 'next/navigation';
import React from 'react';

export interface SearchInputProps {
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  ref: React.RefObject<HTMLInputElement | null>;
  onFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

export default function SearchInput(props: SearchInputProps) {

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      props.onSearch();
    }
  };

  return (
    <div className="flex h-10 w-3/5 items-center overflow-hidden rounded-3xl border-2 border-border bg-fg hover:border-border-hover hover:bg-fg-hover">
      <input
        type="text"
        className="h-full min-w-0 flex-1 bg-transparent px-2.5 py-0 text-md leading-10 outline-none"
        placeholder={props.label}
        onChange={props.onChange}
        onFocus={props.onFocus}
        onKeyDown={handleKeyDown}
        value={props.value}
        ref={props.ref}
      />

      <button
        type="button"
        onClick={props.onSearch}
        className="h-7 shrink-0 bg-primary rounded-full w-7 text-md flex items-center justify-center hover:bg-primary-hover mr-1.5"
        aria-label="Szukaj"
      >
        {/* SVG wzięte z https://www.svgrepo.com/svg/222072/right-arrow-next */}
        <svg fill="#000000" height="16px" width="16px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="-51.2 -51.2 614.40 614.40" stroke="#000000" strokeWidth="0.00512003">
          <g id="SVGRepo_bgCarrier" strokeWidth="0" />
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="1.0240060000000002" />
          <g id="SVGRepo_iconCarrier"> <g> <g> <path d="M507.284,248.364L12.35,0.898C8.894-0.826,4.721-0.007,2.153,2.86c-2.56,2.884-2.867,7.125-0.759,10.351l159.07,242.79 L1.393,498.792c-2.108,3.226-1.801,7.467,0.759,10.351c1.664,1.86,4.002,2.859,6.383,2.859c1.289,0,2.594-0.29,3.814-0.896 l494.933-247.467c2.893-1.451,4.719-4.403,4.719-7.637S510.176,249.815,507.284,248.364z" /> </g> </g> </g>
        </svg>
      </button>
    </div>
  );
};