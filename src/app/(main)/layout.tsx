import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Dogs from "@/components/layout/Dogs";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-bg text-text flex min-h-screen flex-col h-screen items-center  overflow-scroll">
      <Header />
      <Sidebar />
      <div className="flex flex-1 gap-2 pt-5 w-9/10 md:w-4/5 lg:w-3/5 mt-20">
        {children}
      </div>
      <Dogs />
    </div>
  );
}
