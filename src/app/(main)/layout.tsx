import { ReactNode, Suspense } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Dogs from "@/components/layout/Dogs";
import SidebarClient from "@/components/layout/Sidebar/components/SidebarClient";
import LoadingInfo from "@/components/ui/LoadingInfo";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-bg text-text flex min-h-screen flex-col h-screen items-center  overflow-scroll">
      <Header />
      <Suspense fallback={<SidebarClient><LoadingInfo text="Loading sidebar..." style="h-full text-primary" /></SidebarClient>}>
        <Sidebar />
      </Suspense>
      <div className="flex flex-1 gap-2 pt-5 w-9/10 md:w-4/5 lg:w-3/5 mt-20">
        {children}
      </div>
      <Dogs />
    </div>
  );
}
