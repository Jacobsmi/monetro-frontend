import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthedSidebar } from "./AuthedSidebar";
import AuthedDropdown from "./AuthedDropdown";

export default function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AuthedSidebar />
      <main className="w-full p-4 bg-gray-100 flex flex-col items-center">
        <div className="flex items-center justify-between w-full max-w-[1200px]">
          <SidebarTrigger />
          <AuthedDropdown />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
