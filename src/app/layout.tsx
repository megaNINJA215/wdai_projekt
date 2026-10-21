import { ReactNode } from "react";
import ClientProviders from "./ClientProviders";
import "./global.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <ClientProviders>
          <div className="bg-bg-dark text-text flex min-h-screen">
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
