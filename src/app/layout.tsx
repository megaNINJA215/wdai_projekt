import { ReactNode } from "react";
import ClientProviders from "./ClientProviders";
import "./global.css";
import AuthSync from "@/components/auth/AuthSync";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <ClientProviders>
          <AuthSync />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
