import { ReactNode } from "react";
import ClientProviders from "./ClientProviders";
import "./global.css";
import AuthSync from "@/components/auth/AuthSync";
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: "#1a1b18",
};

export const metadata: Metadata = {
  title: 'MediocRe',
  description: '...',
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl" className="bg-bg text-text">
      <body className="bg-bg text-text pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <ClientProviders>
          <AuthSync />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
