"use client";

import { cn } from '@/utils/cn';
import React, { useState } from 'react';

export interface AccordionProps {
  children: React.ReactNode;
  title: string;
}

export default function Accordion(props: AccordionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={cn("w-9/10 min-h-14 mx-auto flex flex-col overflow-hidden transition-[flex-grow] duration-500 ease-in-out h-full", isOpen ? "grow" : "grow-0")}>
      <button onClick={() => setIsOpen(prev => !prev)}
        className="flex flex-row h-10 w-full mx-auto relative text-md items-center justify-center py-2 
                   hover:cursor-pointer text-text hover:text-text-muted transition-colors duration-250 font-semibold
                   after:absolute after:top-[calc(100%-0.5rem)] after:left-0
                   after:h-4 after:w-full
                   after:bg-linear-to-b after:from-fg-muted after:to-transparent">
        {props.title} <div className={cn("ml-1 h-8 w-6 flex items-center justify-center duration-500 ease-in-out transition-transform", isOpen ? "-rotate-180" : "")}>
          {/* https://www.svgrepo.com/svg/509899/down-chevron */}
          <svg viewBox="0 -1 24 28" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1" className="transition-colors duration-250">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path fillRule="evenodd" clipRule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="currentColor"></path>
            </g>
          </svg>
        </div>
      </button>

      <div
        className={cn(
          "grid min-h-0 flex-1 transition-[grid-template-rows] duration-500 ease-in-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      ><div
        className={cn(
          "min-h-0 overflow-x-hidden overflow-y-auto",
          "transition-[padding] duration-500",
          isOpen ? "pt-2" : "pt-0"
        )}
      >
          {props.children}
        </div>
      </div>
    </div>
  );
};