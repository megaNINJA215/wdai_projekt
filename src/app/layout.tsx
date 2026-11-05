import { ReactNode } from "react";
import ClientProviders from "./ClientProviders";
import "./global.css";
import AuthSync from "@/components/auth/AuthSync";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MediocRe',
  description: '...',
}

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
