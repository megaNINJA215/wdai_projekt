import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-bg text-text flex min-h-screen flex-col h-screen items-center justify-center overflow-scroll">
      {children}
    </div>
  );
}
