
"use client";

import { useState } from "react";

export default function TextFormattingInfo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative inline-flex items-center text-text"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onBlur={(e) => {
          if (!e.currentTarget.parentElement?.contains(e.relatedTarget)) {
            setIsOpen(false);
          }
        }}
        aria-label="Informacje o formatowaniu tekstu"
        aria-expanded={isOpen}
        className="text-text hover:text-text-secondary transition-colors text-xs border-white border h-5 w-5 rounded-full flex items-center justify-center hover:bg-bg-hover"
      >
        ?
      </button>

      {isOpen && (
        <div className="absolute z-50 -top-2 right-8 mb-3 rounded-xl border border-border bg-background shadow-xl p-4 text-sm bg-fg-hover">
          <h3 className="font-semibold text-base mb-3 text-center text-primary">
            Formatowanie tekstu
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-10">
              <span className="flex items-center gap-2">
                Pogrubienie
              </span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                **tekst**
              </code>
            </div>

            <div className="flex items-center justify-between gap-10">
              <span className="flex items-center gap-2">
                Kursywa
              </span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                __tekst__
              </code>
            </div>

            <div className="flex items-center justify-between gap-10">
              <span className="flex items-center gap-2">
                Przekreślenie
              </span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                ~~tekst~~
              </code>
            </div>

            <div className="flex items-center justify-between gap-10">
              <span className="flex items-center gap-2">
                Link
              </span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                [tekst](link)
              </code>
            </div>

            <div className="flex items-center justify-between gap-10">
              <span className="flex items-center gap-2">
                Kod
              </span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                ```lang<br />
                kod<br />
                ```
              </code>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center text-balance text-text-secondary-hover">
            Możesz używać tych znaczników podczas pisania posta. Będą one widoczne dopiero po publikacji.
          </p>
        </div>
      )}
    </div>
  );
}
